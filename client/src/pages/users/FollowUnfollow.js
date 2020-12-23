import React from "react";
import Button from "react-bootstrap/Button";
import { followUser, unfollowUser } from "../../api/user";

const FollowUnfollow = (props) => {
  const followHandler = () => {
    props.onButtonClick(followUser);
  };

  const unfollowHandler = () => {
    props.onButtonClick(unfollowUser);
  };

  return (
    <>
      {props.following ? (
        <Button variant='primary' onClick={followHandler}>
          Follow
        </Button>
      ) : (
        <Button variant='secondary' onClick={unfollowHandler}>
          Unfollow
        </Button>
      )}
    </>
  );
};

export default FollowUnfollow;
