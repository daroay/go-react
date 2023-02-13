import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Input from "./form/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const navitage = useNavigate();

  useEffect(() => {
    if (isSubmitted && !email.includes("@")) {
      setEmailError("Email has wrong format")
    } else {
      setEmailError("")
    }
  }, [email, isSubmitted])

  const { setJwtToken } = useOutletContext();

  const { setAlertClassName, setAlertMessage } = useOutletContext();

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    console.log("email/pass", email, password);

    if (email === "admin@example.com") {
      setJwtToken("some-jwtToken");
      setAlertClassName("d-none");
      setAlertMessage("");
      navitage("/")
    } else {
      setAlertClassName("alert-danger");
      setAlertMessage("Invalid Credentials");
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Login</h2>
      <hr />

      <form onSubmit={handleSubmit}>
        <Input
          title="Email address"
          type="email"
          className="form-control"
          name="email"
          autoComplete="email-new"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          value={email}
          placeHolder="email"
          errorMessage={emailError}
        />

        <Input
          title="Password"
          type="password"
          className="form-control"
          name="password"
          autoComplete="password-new"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          value={password}
          placeHolder="password"
          errorMessage=""
        />

        <hr />

        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
    </div>
  );
};

export default Login;
