import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import NavbarItem from "./components/Navbar";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import EditUser from "./pages/users/EditUser";
import Profile from "./pages/users/Profile";
import SignIn from "./pages/users/Signin";
import Signup from "./pages/users/Signup";
import Users from "./pages/users/Users";

const App = () => {
  return (
    <Router>
      <NavbarItem />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/user/:userId' component={Profile} />
        <PrivateRoute exact path='/user/edit/:userId' component={EditUser} />
        <Route exact path='/users' component={Users} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/signin' component={SignIn} />
        <Route exact path='/contact-us' component={Contact} />
      </Switch>
    </Router>
  );
};

export default App;
