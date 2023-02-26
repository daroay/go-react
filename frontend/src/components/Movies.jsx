import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import normalizeImage from "../helpers/normalizeImage";
import Sign from "../images/sign.png";

const Movies = () => {
  const signSrc = normalizeImage(Sign)
  const [movies, setMovies] = useState(null);

  const { api } = useOutletContext()

  useEffect(() => {
    if (api === null) {
      return
    }

    (async () => {
      setMovies(await api.fetchMovies())
    })()
  }, [api]);

  return (
    <div>
      <h2>Movies</h2>
      <hr />
      <img src={signSrc} alt="movie tickets" width="200px" height="100px" />
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Movie</th>
            <th>Release Date</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {movies && movies.map((m) => (
            <tr key={m.id}>
              <td>
                <Link to={`/movies/${m.id}`}>{m.title}</Link>
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

export default Movies;
