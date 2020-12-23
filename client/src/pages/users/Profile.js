import React, { useState, useEffect } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Card from "react-bootstrap/Card";
import { Link, Redirect } from "react-router-dom";
import { deleteUser, getUserById } from "../../api/user";
import auth from "../../helpers/auth";

const Profile = ({ match }) => {
  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectToSignIn] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getUserById({ userId: match.params.userId }, { t: jwt.token }, signal).then(
      (data) => {
        if (data && data.error) {
          setRedirectToSignIn(true);
        } else {
          setUser(data);
        }
      }
    );

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId, jwt.token]);

  if (redirectToSignin) {
    return <Redirect to='/signin' />;
  }

  const handleDelete = () => {
    deleteUser({ userId: match.params.userId }, { t: jwt.token }).then(
      (data) => {
        if (data && data.error) {
          console.log(data.error);
        } else {
          auth.clearJWT(() => console.log("deleted"));
          setRedirect(true);
        }
      }
    );
  };

  if (redirect) {
    return <Redirect to='/' />;
  }

  return (
    <div className='container'>
      <Jumbotron>
        <h1>Profile</h1>
        <p>This is a profile page.</p>
      </Jumbotron>

      <Card style={{ width: "18rem" }} className='mb-5'>
        <Card.Img variant='top' src='' />
        <Card.Body>
          <Card.Title>Name: {user.name}</Card.Title>
          <Card.Text>Email: {user.email}</Card.Text>
          <Card.Text>
            Joined: {new Date(user.createdAt).toDateString()}
          </Card.Text>
          {auth.isAuthenticated().user &&
            auth.isAuthenticated().user._id === user._id && (
              <Card.Body>
                <Card.Text>
                  <Link to={"/user/edit/" + user._id}>Edit</Link>
                </Card.Text>
                <button onClick={handleDelete}>Delete</button>
              </Card.Body>
            )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;
