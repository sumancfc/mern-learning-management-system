import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import { signin } from "../../api/auth";
import auth from "../../helpers/auth";

const SignIn = (props) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirectToReferrer: false,
  });

  const { email, password, error, redirectToReferrer } = values;

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    if (jwt.token) {
      props.history.push("/");
    }
  }, [jwt.token, props.history]);

  const handleChange = (name) => (e) => {
    console.log(e.target.value);
    setValues({ ...values, [name]: e.target.value, error: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      email,
      password,
    };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: "", redirectToReferrer: true });
        });
      }
    });
  };

  const { from } = props.location.state || {
    from: {
      pathname: "/",
    },
  };

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }

  return (
    <div className='container'>
      <Jumbotron>
        <h1>Sign In</h1>
        <p>This is a simple sign in page.</p>
      </Jumbotron>

      <div>
        {error && <p className='alert alert-danger'>{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              name='email'
              value={email}
              onChange={handleChange("email")}
              required
            />
            <Form.Text className='text-muted'>
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              name='password'
              value={password}
              onChange={handleChange("password")}
              required
            />
          </Form.Group>

          <Button variant='primary' type='submit'>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
