import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";



const Movie = () => {
  const [movie, setMovie] = useState(null);
  let { id } = useParams();

  const { api } = useOutletContext()

  useEffect(() => {
    console.log("2", api)
    if (api !== null) {
      (async () => {
        setMovie(await api.fetchMovie(id))
      })()
    }
  }, [id, api]);

  return (
    <div>
      {movie && (
        <>
          <h2>Movie: {movie.title}</h2>
          <small>
            <em>
              {`${movie.release_date}, ${movie.runtime} minutes ${movie.mpaa_rating}`}

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
