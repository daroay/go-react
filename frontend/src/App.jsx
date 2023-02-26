
import { authorizedAxios, unAuthorizedAxios } from "./helpers/axiosFactory"
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Alert from "./components/Alert";
import { getAccessToken, logOut, logIn } from "./helpers/access";
import RestAPI from "./helpers/restApi"

function App() {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");

  // null: unkown yet, true: logged in, false: not logged in
  const [isUILoggedIn, setIsUILoggedIn] = useState(null)
  const [api, setApi] = useState(null)

  const navigate = useNavigate();


  useEffect(() => {
    (async () => {
      const token = await getAccessToken()
      if (token) {
        setIsUILoggedIn(true)
        setApi(new RestAPI(authorizedAxios(token)))
      } else {
        setIsUILoggedIn(false)
        setApi(new RestAPI(unAuthorizedAxios()))
      }
    })()
  }, [])

  const doLogOut = () => {
    logOut(() => {
      setIsUILoggedIn(false)
      setApi(new RestAPI(unAuthorizedAxios()))
      navigate("/");
    })
  }

  const doLogIn = (payload) => {
    logIn(
      payload,
      async () => {
        setIsUILoggedIn(true)
        const token = await getAccessToken()
        setApi(new RestAPI(authorizedAxios(token)))
        setAlertClassName("d-none")
        setAlertMessage("")
        navigate("/")
      },
      (errorMessage) => {
        setAlertClassName("alert-danger");
        setAlertMessage(errorMessage);
      }
    )
  }

  const alertOut = (message, alertClassName) => {
    setAlertMessage(message)
    setAlertClassName(alertClassName)
    setTimeout(() => {
      setAlertMessage("")
      setAlertClassName("d-none")
    }, 1000 * 4)
  }



  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1 className="mt-3">Go Watch a Movie!</h1>
        </div>
        <div className="col text-end">
          {!isUILoggedIn ? (
            <Link to="/login">
              <span className="badge bg-success">Login</span>
            </Link>
          ) : (
            <a href="#!" onClick={doLogOut}>
              <span className="badge bg-danger">Logout</span>
            </a>
          )}
        </div>
        <hr className="mb-3"></hr>
      </div>

      <div className="row">
        <div className="col-md-2">
          <nav>
            <div className="list-group">
              <Link to="/" className="list-group-item list-group-item-action">
                Home
              </Link>
              <Link
                to="/movies"
                className="list-group-item list-group-item-action"
              >
                Movies
              </Link>
              <Link
                to="/genres"
                className="list-group-item list-group-item-action"
              >
                Genres
              </Link>
              {isUILoggedIn && (
                <>
                  <Link
                    to="/admin/movies/0/edit"
                    className="list-group-item list-group-item-action"
                  >
                    Add Movie
                  </Link>
                  <Link
                    to="/admin/manage-catalogue"
                    className="list-group-item list-group-item-action"
                  >
                    Catalog
                  </Link>
                  <Link
                    to="/graphql"
                    className="list-group-item list-group-item-action"
                  >
                    GraphQL
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
        <div className="col-md-10">
          <Alert message={alertMessage} className={alertClassName} />
          <Outlet
            context={{
              isUILoggedIn,
              doLogIn,
              api,
              alertOut,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
