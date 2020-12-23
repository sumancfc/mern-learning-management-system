import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, withRouter } from "react-router-dom";
import auth from "../../helpers/auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#ff4081" };
  else return { color: "#ffffff" };
};

const NavbarItem = withRouter(({ history, match }) => {
  const userId = match.params;
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
          <Link
            to='/users'
            className='nav-link'
            style={isActive(history, "/users")}
          >
            Users
          </Link>
          {auth.isAuthenticated() && (
            <>
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
