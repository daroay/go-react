import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";

const Genres = () => {
  const [genres, setGenres] = useState(null);

  const { api, alertOut } = useOutletContext();

  useEffect(() => {
    (async () => {
      if (api === null) {
        return;
      }
      try {
        const genres = await api.fetchGenres()
        setGenres(genres)
      } catch (ex) {
        alertOut(ex.toString(), "alert-danger")
      }
    })();
  }, [api]);

  return (
    <div>
      <h2>Genres</h2>
      <hr />

      <div className="list-group">
        {genres && genres.map((g) => {
          return (

            <Link
              key={g.id}
              to={`/genres/${g.id}`}
              className="list-group-item list-group-item-action"
              state={
                { genreName: g.genre }
              }
            >{g.genre}</Link>
          )
        })}
      </div>

    </div >
  );
};

export default Genres;
