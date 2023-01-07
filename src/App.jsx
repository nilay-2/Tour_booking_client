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
import ImageLoader from "./components/ImageLoader";
function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" exact element={<Overview Loader={Loader} />} />
          <Route
            path="/tours/:slug"
            exact
            element={<Tour Loader={Loader} Map={Map} />}
          />
          <Route path="/login" exact element={<Login />} />
          <Route
            path="/me"
            exact
            element={
              <Account
                Loader={Loader}
                Error={Error}
                ImageLoader={ImageLoader}
              />
            }
          />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/forgotPassword" exact element={<ForgotPassword />} />
          <Route
            path="/resetPassword/:token"
            exact
            element={<ResetPassword />}
          />
          <Route
            path="/myTourBookings"
            exact
            element={<MyBookings Loader={Loader} NoBookings={NoBookings} />}
          />
          <Route
            path="/myReviews"
            exact
            element={<MyReviews Loader={Loader} ImageLoader={ImageLoader} />}
          />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
