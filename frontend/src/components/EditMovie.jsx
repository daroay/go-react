import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Input from "./form/Input";
import Select from "./form/Select";
import TextArea from "./form/TextArea";

const EditMovie = () => {

  const navigate = useNavigate()
  const { jwtToken, isUILoggedIn } = useOutletContext()

  const [error, setError] = useState(null)
  const [errors, setErrors] = useState([])

  const hasError = (key) => {
    return errors.indexOf(key) !== -1
  }

  const mpaaOptions = [
    { id: "G", value: "G", },
    { id: "PG", value: "PG", },
    { id: "PG-13", value: "PG-13", },
    { id: "R", value: "R", },
    { id: "NC-17", value: "NC-17", },
    { id: "18A", value: "18A", },
  ]

  const [movie, setMovie] = useState({
    id: 0,
    title: "",
    release_date: "",
    runtime: "",
    mpaa_rating: "",
    description: "",
  })

  let { id } = useParams();

  useEffect(() => {
    if (isUILoggedIn !== null) {
      if (!isUILoggedIn) {
        navigate("/")
        return
      }
    }
  }, [jwtToken, isUILoggedIn])

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

  return (
    <div>
      <h2>Add/Edit Movie</h2>
      <hr />
      <pre>{JSON.stringify(movie, null, 3)}</pre>

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

      </form>
    </div>
  );
};

export default EditMovie;
