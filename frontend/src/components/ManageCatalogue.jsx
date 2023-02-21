import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Sign from "../images/sign.png";

const ManageCatalog = () => {
  const [movies, setMovies] = useState([]);

  const { jwtToken, isUILoggedIn } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUILoggedIn !== null) {
      if (!isUILoggedIn) {
        navigate("/");
        return
      }
      if (isUILoggedIn) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + jwtToken.current)

        const requestOptions = {
          method: "GET",
          headers: headers,
        };

        fetch(`/api/admin/movies`, requestOptions)
          .then((response) => response.json())
          .then((data) => setMovies(data))
          .catch((err) => console.log(err));
      }
    }
  }, [isUILoggedIn, jwtToken, navigate]);

  return (
    <div>
      <h2>Movie Catalog</h2>
      <hr />
      <img src={Sign} alt="movie tickets" width="200px" height="100px" />
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Movie</th>
            <th>Release Date</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m) => (
            <tr key={m.id}>
              <td>
                <Link to={`/admin/movies/${m.id}/edit`}>{m.title}</Link>
              </td>
              <td>{m.release_date}</td>
              <td>{m.mpaa_rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCatalog;
