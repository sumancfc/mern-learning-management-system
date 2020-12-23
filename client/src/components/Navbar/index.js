import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, withRouter } from "react-router-dom";
import auth from "../../helpers/auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#ff4081" };
  else return { color: "#ffffff" };
};

const partIsActive = (history, path) => {
  if (history.location.pathname.includes(path))
    return { color: "#fffde7", backgroundColor: "#f57c00", marginRight: 10 };
  else
    return {
      color: "#616161",
      backgroundColor: "#fffde7",
      border: "1px solid #f57c00",
      marginRight: 10,
    };
};

const NavbarItem = withRouter(({ history }) => {
  return (
    <>
      <Navbar bg='dark' variant='dark'>
        <Navbar.Brand href='#home'>React</Navbar.Brand>
        <Nav className='ml-auto'>
          <Link to='/' className='nav-link' style={isActive(history, "/")}>
            Home
          </Link>
          {!auth.isAuthenticated() && (
            <>
              <Link
                to='/signup'
                className='nav-link'
                style={isActive(history, "/signup")}
              >
                Signup
              </Link>
              <Link
                to='/signin'
                className='nav-link'
                style={isActive(history, "/signin")}
              >
                Signin
              </Link>
            </>
          )}

          {auth.isAuthenticated() && (
            <>
              {auth.isAuthenticated().user.educator && (
                <Link
                  to='/teach/courses'
                  style={partIsActive(history, "/teach/")}
                >
                  <button className='btn btn-primary'>Teach</button>
                </Link>
              )}

              <Link
                to={"/user/" + auth.isAuthenticated().user._id}
                className='nav-link'
                style={isActive(
                  history,
                  "/user/" + auth.isAuthenticated().user._id
                )}
              >
                Profile
              </Link>
              <button
                color='inherit'
                onClick={() => {
                  auth.clearJWT(() => history.push("/"));
                }}
              >
                Sign out
              </button>
            </>
          )}
        </Nav>
      </Navbar>
    </>
  );
});

export default NavbarItem;
