import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import { createUser } from "../../api/user";
import { Link, Redirect } from "react-router-dom";
import auth from "../../helpers/auth";

const Signup = ({ history }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    redirectToSignin: false,
  });

  const { name, email, password, error, redirectToSignin } = values;

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    if (jwt.token) {
      history.push("/");
    }
  }, [history, jwt.token]);

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name,
      email,
      password,
    };

    createUser(user).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: "", redirectToSignin: true });
      }
    });
  };

  if (redirectToSignin) {
    return <Redirect to='/signin' />;
  }

  return (
    <div className='container'>
      <Jumbotron>
        <h1>Sign Up Here</h1>
        <p>This is a simple signup page.</p>
      </Jumbotron>

      <p>{error && error}</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter name'
            name='name'
            value={name}
            onChange={handleChange("name")}
            required
          />
        </Form.Group>

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

        <p>
          Already have an account? Please, <Link to='/signin'>Login</Link>
        </p>

        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Signup;
