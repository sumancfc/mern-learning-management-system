import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { findUser, followUser } from "../../api/user";
import auth from "../../helpers/auth";

const FindUser = () => {
  const [values, setValues] = useState({
    users: [],
    open: false,
    followMessage: "",
  });

  const jwt = auth.isAuthenticated();

  console.log(values.users);

  useEffect(() => {
    findUser(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, users: data });
      }
    });
  }, []);

  const clickFollow = (user, index) => {
    followUser(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      user._id
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        let toFollow = values.users;
        toFollow.splice(index, 1);
        setValues({
          ...values,
          users: toFollow,
          open: true,
          followMessage: `Following ${user.name}!`,
        });
      }
    });
  };

  return (
    <ListGroup>
      {values.users.map((user, i) => {
        return (
          <ListGroup.Item key={i}>
            {user.name}
            <Button
              aria-label='Follow'
              variant='contained'
              color='primary'
              onClick={() => {
                clickFollow(user, i);
              }}
            >
              Follow
            </Button>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default FindUser;
