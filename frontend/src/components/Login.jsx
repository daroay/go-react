import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Input from "./form/Input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const { doLogIn } = useOutletContext();

  useEffect(() => {
    if (isSubmitted && !email.includes("@")) {
      setEmailError("Email has wrong format")
    } else {
      setEmailError("")
    }
  }, [email, isSubmitted])


  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    // Build the request payload
    let payload = {
      email: email,
      password: password,
    }

    doLogIn(payload)
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
