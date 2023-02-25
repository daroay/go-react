import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { humanTime } from "../helpers/dateParser";



const Movie = () => {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  let { id } = useParams();

  const { api } = useOutletContext()

  useEffect(() => {
    if (api === null) {
      return
    }
    (async () => {
      try {
        const api_movie = await api.fetchMovie(id)
        setMovie(api_movie)
      } catch (ex) {
        setError(ex.toString())
      }
    })()

  }, [id, api]);

  return (
    <div>
      <div className={error ? "text-danger" : "d-none"}>{error}</div>
      {movie && (
        <>
          <h2>Movie: {movie.title}</h2>
          <small>
            <em>
              {`${humanTime(movie.release_date)}, ${movie.runtime} minutes ${movie.mpaa_rating}`}

            </em>
          </small>
          <div>
            {movie.genres.map((g) => {
              return <span key={g.genre} className="badge bg-secondary me-2">{g.genre}</span>
            })}
          </div>
          <hr />
          {movie.image !== "" &&
            <div className="mb-3">
              <img src={`https://image.tmdb.org/t/p/w200/${movie.image}`} alt="movie poster" />
            </div>
          }
          <p>{movie.description}</p>
        </>
      )}
    </div>
  );
};

export default Movie;
