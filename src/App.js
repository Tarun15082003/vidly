import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Movies from "./components/movies";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React, { Component } from "react";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./components/notfound";
import NavBar from "./components/navbar";
import MovieForm from "./components/movieform";
import LoginForm from "./components/loginform";
import RegisterForm from "./components/registerForm";
import Logout from "./components/logout";
import * as authService from "./services/authService";
import ProtectedRoute from "./components/common/protectedRoute";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = authService.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    return (
      <div>
        <ToastContainer />
        <NavBar user={user} />
        <main className="container">
          <Switch>
            <Route path="/register" component={RegisterForm}></Route>
            <Route path="/login" component={LoginForm}></Route>
            <Route path="/logout" component={Logout}></Route>
            <ProtectedRoute
              path="/movies/:id"
              component={MovieForm}
            ></ProtectedRoute>
            <Route
              path="/movies"
              render={(props) => <Movies {...props} user={this.state.user} />}
            ></Route>
            <Route path="/customers" component={Customers}></Route>
            <Route path="/rentals" component={Rentals}></Route>
            <Route path="/notfound" component={NotFound}></Route>
            <Redirect from="/" exact to="/movies" />
            <Redirect to="/notfound" />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
