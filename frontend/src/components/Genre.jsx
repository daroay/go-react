import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom"


const Genre = () => {
  const { api, alertOut } = useOutletContext()

  // set stateful variables
  const [genre, setGenre] = useState(null)
  const [movies, setMovies] = useState(null)

  // get id from url
  let { id } = useParams()

  // useEffect to list movies
  useEffect(() => {
    if (api === null || id === null) {
      return
    }
    (async () => {
      try {
        const genre = await api.fetchGenre(id)
        setGenre(genre)
        const movies = await api.fetchMoviesByGenreId(genre.id)
        setMovies(movies)
      } catch (ex) {
        alertOut(ex.toString(), "alert-danger")
      }
    })()
  }, [api, id])

  // return jsx
  return (
    <>
      {genre &&
        <div>
          <h2>Genre: {genre.genre}</h2>
          <hr />
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
      }
    </>

  );
}

export default Genre