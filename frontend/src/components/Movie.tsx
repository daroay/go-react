import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Movie = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  let { id } = useParams();

  useEffect(() => {
    let myMovie = {
      id: 1,
      title: "Highlander",
      release_date: "1986-03-07",
      runtime: 116,
      mpaa_rating: "R",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam rem consectetur maiores nulla hic id, velit amet nihil nisi labore exercitationem cumque commodi aspernatur cum aut quam eligendi officiis atque.",
    };
    setMovie(myMovie);
  }, [id]);

  return (
    <div>
      <h2>Movie: {movie?.title}</h2>
      {movie && (
        <>
          <small>
            <em>
              {`${movie.release_date}, ${movie.runtime} minutes`}
              {movie.mpaa_rating}
            </em>
          </small>
        </>
      )}
      <hr />
      <p>{movie?.description}</p>
    </div>
  );
};

export default Movie;
