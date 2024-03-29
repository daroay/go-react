import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import CheckBox from "./form/CheckBox";
import Input from "./form/Input";
import Select from "./form/Select";
import TextArea from "./form/TextArea";
import { jsDateFormat } from "../helpers/dateParser";

const EditMovie = () => {

  const navigate = useNavigate()
  const { api, isUILoggedIn, alertOut } = useOutletContext()

  const [errors, setErrors] = useState([])

  let { id } = useParams();
  const [movie, setMovie] = useState(null)

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
    if (isUILoggedIn === null || api.current === null) {
      return
    }

    if (!isUILoggedIn) {
      navigate("/")
      return
    }

    (async () => {
      try {
        const genres = await api.admin.fetchGenres()

        const api_movie = id === "0" ? {
          id: 0,
          title: "",
          release_date: "",
          runtime: "",
          mpaa_rating: "",
          description: "",
          genres: [],
          genres_ids: [],
        } : await api.admin.fetchMovie(id)

        const movieGenres = []
        genres.forEach((g) => {
          movieGenres.push({
            ...g,
            checked: api_movie.genres_ids && api_movie.genres_ids.includes(g.id),
          })
        })
        delete api_movie.genres_ids // Re-create this at the end
        setMovie({
          ...api_movie,
          genres: movieGenres,
          release_date: jsDateFormat(api_movie.release_date)
        })
      } catch (ex) {
        alertOut(ex.toString(), "alert-danger")
      }
    })()

  }, [isUILoggedIn, api, navigate, id])


  const handleSubmit = (event) => {
    event.preventDefault();

    let errors = []
    let required = [
      { field: movie.title, name: "title" },
      { field: movie.release_date, name: "release_date" },
      { field: movie.runtime, name: "runtime" },
      { field: movie.description, name: "description" },
      { field: movie.mpaa_rating, name: "mpaa_rating" }
    ]

    required.forEach((obj) => {
      if (obj.field === "") {
        errors.push(obj.name)
      }
    })

    const genres_ids = []
    movie.genres.forEach((obj) => {
      if (obj.checked) {
        genres_ids.push(obj.id)
      }
    })

    if (genres_ids.length === 0) {
      errors.push("genres")
    }

    setErrors(errors)

    if (errors.length > 0) {
      Swal.fire({
        title: "Error",
        text: "Movie details are incomplete",
        icon: "error",
        confirmButtonText: "ok"
      })
      return false
    }

    (async () => {
      // passed validations, so save changes
      const data = await api.admin.saveMovie(movie.id ? parseInt(movie.id) : 0, {
        ...movie,
        genres_ids: genres_ids,
        release_date: new Date(movie.release_date),
        runtime: parseInt(movie.runtime, 10),
      })
      if (data.error) {
        console.log(data.error)
      } else {
        navigate("/admin/manage-catalogue")
      }

    })()


  }

  const handleChange = () => (event) => {
    let value = event.target.value;
    let name = event.target.name;
    console.log("old", name, movie[name])
    console.log("new", name, value)
    setMovie({
      ...movie,
      [name]: value
    })
  }

  const handleCheckBox = (event, idx) => {
    const tmpGenres = movie.genres
    tmpGenres[idx].checked = !tmpGenres[idx].checked
    setMovie({
      ...movie,
      genres: tmpGenres
    })
  }

  const addOrEditTitle = () => {
    if (id === "0") {
      return "Add movie"
    } else {
      return "Edit movie"
    }
  }

  const confirmDelete = () => {
    Swal.fire({
      title: 'Delete movie?',
      text: "You cannot undo this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          try {
            await api.admin.deleteMovie(movie.id)
            navigate("/admin/manage-catalogue")
          } catch (ex) {
            alertOut(ex.toString(), "alert-danger")
          }
        })()
      }
    })
  }

  const fileSelectedHandler = (event) => {
    console.log(event.target.files[0])
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
              placeHolder={"YYYY-MM-DD"}
              name={"release_date"}
              value={jsDateFormat(movie.release_date)}
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
              value={movie.mpaa_rating}
              onChange={handleChange("mpaa_rating")}
              placeHolder={"Choose"}
              errorMessage={"Please choose"}
              errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
            ></Select>

            <Input
              title={"Image"}
              type={"file"}
              onChange={fileSelectedHandler}
              className={"form-control"}
              name={"Image"}
            ></Input>

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


            {movie.genres.map((g, idx) => {
              return (<CheckBox
                key={"genre-" + g.id}
                id={"genre-" + g.id}
                value={g.id}
                name={"genre"}
                title={g.genre}
                checked={g.checked}
                onChange={(event) => { handleCheckBox(event, idx) }}
              />)
            })}
            <div className={hasError("genres") ? "text-danger" : "d-none"}>You must select at least 1 genre</div>

            <hr />

            <button className="btn btn-primary">Save</button>
            {movie.id > 0 &&
              <a href="#!" className="btn btn-danger ms-2" onClick={confirmDelete}>Delete</a>
            }

          </form>
        </>}
    </div>
  );
};

export default EditMovie;
