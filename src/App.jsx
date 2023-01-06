import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Overview from "./components/Overview";
import Tour from "./components/Tour";
import Map from "./components/Map";
import Login from "./components/Login";
import Error from "./components/Error";
import Account from "./components/Account";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import MyBookings from "./components/MyBookings";
import NoBookings from "./components/NoBookings";
import MyReviews from "./components/MyReviews";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          exact
          element={<Overview Header={Header} Footer={Footer} Loader={Loader} />}
        />
        <Route
          path="/tours/:slug"
          exact
          element={
            <Tour Header={Header} Footer={Footer} Loader={Loader} Map={Map} />
          }
        />
        <Route
          path="/login"
          exact
          element={<Login Header={Header} Footer={Footer} />}
        />
        <Route
          path="/me"
          exact
          element={
            <Account
              Header={Header}
              Footer={Footer}
              Loader={Loader}
              Error={Error}
            />
          }
        />
        <Route
          path="/signup"
          exact
          element={<SignUp Header={Header} Footer={Footer} />}
        />
        <Route
          path="/forgotPassword"
          exact
          element={<ForgotPassword Header={Header} Footer={Footer} />}
        />
        <Route
          path="/resetPassword/:token"
          exact
          element={<ResetPassword Header={Header} Footer={Footer} />}
        />
        <Route
          path="/myTourBookings"
          exact
          element={
            <MyBookings
              Header={Header}
              Footer={Footer}
              Loader={Loader}
              NoBookings={NoBookings}
            />
          }
        />
        <Route
          path="/myReviews"
          exact
          element={
            <MyReviews Header={Header} Footer={Footer} Loader={Loader} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
