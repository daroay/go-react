import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CheckBox from "./form/CheckBox";
import Input from "./form/Input";
import Select from "./form/Select";
import TextArea from "./form/TextArea";

const EditMovie = () => {

  const navigate = useNavigate()
  const { jwtToken, isUILoggedIn } = useOutletContext()

  const [error, setError] = useState(null)
  const [errors, setErrors] = useState([])

  let { id } = useParams();
  const [movie, setMovie] = useState(null)


  const fetchGenres = useCallback(async () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${jwtToken.current}`);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    return fetch(`/api/admin/genres`, requestOptions)
      .then((response) => response.json())
      .catch((err) => console.log(err));
  }, [jwtToken])

  const fetchMovie = useCallback(async () => {
    if (id === "0") {
      return {
        id: 0,
        title: "",
        release_date: "",
        runtime: "",
        mpaa_rating: "",
        description: "",
        genres: [],
        genres_ids: [],
      }
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${jwtToken.current}`);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    return fetch(`/api/admin/movies/${id}`, requestOptions)
      .then((response) => response.json())
      .catch((err) => console.log(err));
  }, [jwtToken, id])

  const mpaaOptions = [
    { id: "G", value: "G", },
    { id: "PG", value: "PG", },
    { id: "PG-13", value: "PG-13", },
    { id: "R", value: "R", },
    { id: "NC-17", value: "NC-17", },
    { id: "18A", value: "18A", },
  ]

  const hasError = (key) => {
    return errors.indexOf(key) !== -1
  }

  // fetch stuff once logged in
  useEffect(() => {
    if (isUILoggedIn === null) {
      return
    }

    if (!isUILoggedIn) {
      navigate("/")
      return
    }

    (async () => {
      const genres = await fetchGenres()
      const movie = await fetchMovie()
      const movieGenres = []
      genres.forEach((g) => {
        movieGenres.push({
          ...g,
          checked: movie.genres_ids.includes(g.id),
        })
      })
      setMovie(m => ({
        ...movie,
        genres: movieGenres
      }))
    })()

  }, [isUILoggedIn, fetchGenres, fetchMovie, navigate])


  const handleSubmit = (event) => {
    event.preventDefault();
  }

  const handleChange = () => (event) => {
    let value = event.target.value;
    let name = event.target.name;
    setMovie({
      ...movie,
      [name]: value
    })
  }

  const addOrEditTitle = () => {
    if (id === "0") {
      return "Add movie"
    } else {
      return "Edit movie"
    }
  }

  return (
    <div>
      {movie &&
        <>
          <h2>{addOrEditTitle()}</h2>
          <hr />
          {/* <pre>{JSON.stringify(movie, null, 3)}</pre> */}

          <form onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={movie.id} id="id"></input>
            <Input
              title={"Title"}
              className={"form-control"}
              type={"text"}
              name={"title"}
              value={movie.title}
              onChange={handleChange("title")}
              errorDiv={hasError("title") ? "text-danger" : "d-none"}
              errorMessage={"Please enter a title"}
            />

            <Input
              title={"Release Date"}
              className={"form-control"}
              type={"date"}
              name={"release_date"}
              value={movie.release_date}
              onChange={handleChange("release_date")}
              errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
              errorMessage={"Please enter a release date"}
            />

            <Input
              title={"Run Time"}
              className={"form-control"}
              type={"number"}
              name={"runtime"}
              value={movie.runtime}
              onChange={handleChange("runtime")}
              errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
              errorMessage={"Please enter a runtime"}
            />

            <Select
              title={"MPAA Rating"}
              name={"mpaa_rating"}
              options={mpaaOptions}
              onChange={handleChange("mpaa_rating")}
              placeHolder={"Choose"}
              errorMessage={"Please choose"}
              errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
            ></Select>

            <TextArea
              title="Description"
              name={"description"}
              value={movie.description}
              rows={"3"}
              onChange={handleChange("description")}
              errorMessage={"Please enter a description"}
              errorDiv={hasError("description") ? "text-danger" : "d-none"}
            ></TextArea>

            <hr />
            <h3>Genres</h3>

            {Array.from(movie.genres).map((g) => {
              return (<CheckBox
                key={"genre-" + g.id}
                id={"genre-" + g.id}
                value={g.id}
                name={"genre"}
                title={g.genre}
                checked={g.checked}
                onChange={(e) => { }}
              />)
            })}

          </form>
        </>}
    </div>
  );
};

export default EditMovie;
