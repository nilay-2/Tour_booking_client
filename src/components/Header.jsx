import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "./utils/util";
import { storage } from "./utils/firebase";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
const Header = () => {
  const [userInfo, setUserInfo] = useState();
  const [imageURL, setImageURL] = useState("");
  useEffect(() => {
    if (localStorage.getItem("userData")) {
      setUserInfo(JSON.parse(localStorage.getItem("userData")));
    }
    const imageListRef = ref(storage, "images/users/");
    listAll(imageListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          const currUserPhoto = JSON.parse(
            localStorage.getItem("userData")
          ).photo;
          const currImageRef = ref(storage, url);
          // console.log(currImageRef.name);
          // console.log(imageFileName);
          if (currImageRef.name === currUserPhoto) {
            setImageURL(url);
          }
        });
      });
    });
  }, []);
  const logout = async () => {
    const res = await fetch(`${BACKEND_URL}/api/v1/users/logout`, {
      method: "get",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.status !== "success") {
      toast.error("Error while logging out, please try again!", {
        position: "top-center",
      });
      return;
    }
    localStorage.removeItem("userData");
    toast.success("Logged out successfully", {
      position: "top-center",
    });
    setTimeout(() => {
      window.location.assign("/");
    }, 2000);
  };
  return (
    <>
      <ToastContainer />
      <header className="header">
        <nav className="nav nav--tours">
          <a href="/" className="nav__el">
            All tours
          </a>
          <form className="nav__search">
            <button className="nav__search-btn">
              <svg>
                <use href="/img/icons.svg#icon-search"></use>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search tours"
              className="nav__search-input"
            />
          </form>
        </nav>
        <div className="header__logo">
          <img src="/img/logo-white.png" alt="Natours logo" />
        </div>
        <nav className="nav nav--user">
          {userInfo ? (
            <>
              <a href="#" className="nav__el" onClick={logout}>
                Log out
              </a>
              <a href="/me" className="nav__el">
                {userInfo.photo != "default.jpg" ? (
                  <img
                    src={`${imageURL}`}
                    alt="User photo"
                    className="nav__user-img"
                  />
                ) : (
                  <img src="/img/default.jpg" className="nav__user-img" />
                )}
                <span>{userInfo.name.split(" ")[0]}</span>
              </a>
            </>
          ) : (
            <>
              <Link className="nav__el" to="/login">
                Log in
              </Link>
              <Link className="nav__el nav__el--cta" to="/signup">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
