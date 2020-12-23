import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { getUserById, updateUser } from "../../api/user";
import { Redirect } from "react-router-dom";
import auth from "../../helpers/auth";
import profileImage from "../../assets/images/banner-1.png";

const EditUser = ({ match }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
    photo: "",
    error: "",
    id: "",
    redirectToProfile: false,
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
            about: data.about,
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
    let userData = new FormData();
    values.name && userData.append("name", values.name);
    values.email && userData.append("email", values.email);
    values.passoword && userData.append("passoword", values.passoword);
    values.about && userData.append("about", values.about);
    values.photo && userData.append("photo", values.photo);

    updateUser(
      {
        userId: match.params.userId,
      },
      {
        t: jwt.token,
      },
      userData
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, redirectToProfile: true });
      }
    });
  };

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const photoUrl = values.id
    ? `/api/user/photo/${values.id}?${new Date().getTime()}`
    : profileImage;

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
        <Image src={photoUrl} roundedCircle className='w-25' />
        <Form.Group>
          <Form.File
            id='icon-button-file'
            accept='image/*'
            onChange={handleChange("photo")}
          />
        </Form.Group>

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
          <Form.Label>About</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter about'
            id='about'
            name='about'
            value={values.about}
            onChange={handleChange("about")}
            required
          />
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

        <Button variant='primary' type='submit'>
          Edit
        </Button>
      </Form>
    </div>
  );
};

export default EditUser;
