import React, { useState, useEffect } from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import Card from "react-bootstrap/Card";
import { Link, Redirect } from "react-router-dom";
import { deleteUser, getUserById } from "../../api/user";
import auth from "../../helpers/auth";
import FollowUnfollow from "./FollowUnfollow";
import FindUser from "./FindUser";

const Profile = ({ match }) => {
  const [values, setValues] = useState({
    user: { following: [], followers: [] },
    redirectToSignin: false,
    redirect: false,
    following: false,
  });

  const { user, redirect, redirectToSignin, following } = values;

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    getUserById({ userId: match.params.userId }, { t: jwt.token }, signal).then(
      (data) => {
        if (data && data.error) {
          setValues({ ...values, redirectToSignin: true });
        } else {
          let following = checkUserFollow(data);
          // console.log(following);
          setValues({ ...values, user: data, following: following });
        }
      }
    );

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.userId, jwt.token]);

  //check user follow
  const checkUserFollow = (user) => {
    const userMatch = user.followers.some((follower) => {
      return follower._id === jwt.user._id;
    });

    return userMatch;
  };

  const clickFollowButton = (callApi) => {
    callApi(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token },
      user._id
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, user: data, following: !values.following });
      }
    });
  };

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
          setValues({ ...values, redirect: true });
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
          auth.isAuthenticated().user._id === user._id ? (
            <Card.Body>
              <Card.Text>
                <Link to={"/user/edit/" + user._id}>Edit</Link>
              </Card.Text>
              <button onClick={handleDelete}>Delete</button>
            </Card.Body>
          ) : (
            <FollowUnfollow
              following={following}
              onButtonClick={clickFollowButton}
            />
          )}
        </Card.Body>
      </Card>

      <FindUser />
    </div>
  );
};

export default Profile;
