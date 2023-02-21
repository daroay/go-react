import axios from "axios";
import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Alert from "./components/Alert";

function App() {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");

  // useRef is better on Strict.Mode (as in dev it double renders) and re-renders wont affect useRef
  const tickInterval = useRef(null)
  const jwtToken = useRef(null)

  // null: unkown yet, true: logged in, false: not logged in
  const [isUILoggedIn, setIsUILoggedIn] = useState(null)

  const navigate = useNavigate();

  const logOut = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    }

    fetch("/api/logout", requestOptions)
      .catch(error => console.log("error loging out", error))
      .finally(() => {
        jwtToken.current = null
        setIsUILoggedIn(false)
        console.log("jwtToken is", jwtToken)
        stopRefreshingToken()
        navigate("/");
      })

  };


  const getRefreshedToken = async () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    }

    const newToken = await fetch("/api/refresh", requestOptions)
      .then((response) => {
        if (response) {
          return response.json()
        }
      })
      .then((data) => {
        if (data && data.access_token) {
          console.log("New token ", data.access_token)
          return data.access_token
        }
        console.log("user is not logged in")
        return null;
      })
      .catch((error) => console.error("user is not logged in", error))

    return newToken;
  }

  const startRefreshingToken = () => {
    (async () => {
      console.log("ya agarro valor")
      jwtToken.current = await getRefreshedToken()
      if (jwtToken.current !== null) {
        setIsUILoggedIn(true)

        if (tickInterval.current === null) {
          tickInterval.current = setInterval(async () => {
            console.log("this will run every 10 seconds")
            jwtToken.current = await getRefreshedToken()
          }, 10 * 1000)
          console.log("REFRESH ENABLED", tickInterval.current)
        }

      } else {
        console.log("not startRefreshingToken because user is not logged in")
      }
    })()
  }

  const stopRefreshingToken = () => {
    console.log("refresh deactivated", tickInterval.current)
    clearInterval(tickInterval.current)
    tickInterval.current = null
  }

  useEffect(startRefreshingToken, [])


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
            <a href="#!" onClick={logOut}>
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
              jwtToken,
              isUILoggedIn,
              startRefreshingToken,
              setAlertClassName,
              setAlertMessage,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
