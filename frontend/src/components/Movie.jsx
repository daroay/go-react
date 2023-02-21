import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Movie = () => {
  const [movie, setMovie] = useState(null);
  let { id } = useParams();

  const fetchMovie = async (id) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    return fetch(`/api/movies/${id}`, requestOptions)
      .then((response) => response.json())
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    (async () => {
      setMovie(await fetchMovie(id))
    })()
  }, [id]);

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
