import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import { getUserById, updateUser } from "../../api/user";
import { Redirect } from "react-router-dom";
import auth from "../../helpers/auth";

const EditUser = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    redirectToProfile: false,
    educator: false,
  });

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getUserById({ userId: match.params.userId }, { t: jwt.token }, signal).then(
      (data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            id: data._id,
            name: data.name,
            email: data.email,
            educator: data.educator,
          });
        }
      }
    );

    return function cleanup() {
      abortController.abort();
    };
    //eslint-disable-next-line
  }, [match.params.userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      educator: values.educator,
    };

    updateUser(
      {
        userId: match.params.userId,
      },
      {
        t: jwt.token,
      },
      user
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.updateUser(data, () => {
          setValues({ ...values, userId: data._id, redirectToProfile: true });
        });
      }
    });
  };

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleCheck = (event, checked) => {
    setValues({ ...values, educator: checked });
  };

  if (values.redirectToProfile) {
    return <Redirect to={"/user/" + values.id} />;
  }

  return (
    <div className='container'>
      <Jumbotron>
        <h1>Edit User</h1>
        <p>This is a User edit page.</p>
      </Jumbotron>

      <p>{values.error && values.error}</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter name'
            id='name'
            name='name'
            value={values.name}
            onChange={handleChange("name")}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            id='email'
            name='email'
            value={values.email}
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
            id='password'
            name='password'
            value={values.password}
            onChange={handleChange("password")}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>I am a Tutor</Form.Label>
          <Form.Check
            type='switch'
            // id='custom-switch'
            label={values.educator ? "Yes" : "No"}
            checked={values.educator}
            onChange={handleCheck}
          />
        </Form.Group>

        <Button variant='primary' type='submit'>
          Edit
        </Button>
      </Form>
    </div>
  );
};

export default EditUser;
