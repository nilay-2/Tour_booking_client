import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL, setUserImage } from "./utils/util";
import { storage } from "./utils/firebase";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  uploadString,
} from "firebase/storage";
import ImageLoader from "./ImageLoader";
const Header = () => {
  const [userInfo, setUserInfo] = useState();
  const [imageURL, setImageURL] = useState("");
  const [contentList, setContentList] = useState(false);
  const [tourList, setTourList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchErr, setSearchErr] = useState("");
  useEffect(() => {
    if (localStorage.getItem("userData")) {
      setUserInfo(JSON.parse(localStorage.getItem("userData")));
    }
    setUserImage(setImageURL);
  }, []);
  useEffect(() => {
    // setLoading(true); to display loader on each key stroke
    const fetchListOfTours = async () => {
      const res = await fetch(
        `${BACKEND_URL}/api/v1/tours/filterTours?tour=${query}`,
        {
          method: "GET",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        console.log(data);
        setTourList(data.tourList);
        setLoading(false);
      } else {
        setSearchErr(data.message);
        setLoading(false);
        setTourList([]);
      }
    };
    if (query !== "") {
      fetchListOfTours();
    } else {
      setTourList([]);
    }
  }, [query]);
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

  // content list popup
  const getQuery = (e) => {
    setQuery(e.target.value);
  };

  console.log(searchErr);
  return (
    <>
      <ToastContainer />
      <header className="header">
        <nav className="nav nav--tours">
          <Link to="/" className="nav__el">
            All tours
          </Link>
          <form className="nav__search">
            <button className="nav__search-btn">
              <svg>
                <use href="/img/icons.svg#icon-search"></use>
              </svg>
            </button>
            <div className="search_list-container">
              <input
                type="text"
                placeholder="Search tours"
                className="nav__search-input"
                onChange={getQuery}
              />
              {query.length > 0 ? (
                <div className="search_list-content">
                  {loading ? (
                    <div className="serach_list-content center_loader">
                      <ImageLoader />
                    </div>
                  ) : (
                    <>
                      {tourList.length > 0 ? (
                        tourList.map((tour, i) => {
                          return (
                            <div className="tour-card" key={tour.slug}>
                              {tour.startLocation.description}
                            </div>
                          );
                        })
                      ) : (
                        <div className="search-err">{searchErr}</div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
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
              <Link to="/me" className="nav__el">
                {userInfo.photo != "default.jpg" ? (
                  <>
                    {imageURL != "" ? (
                      <img
                        src={`${imageURL}`}
                        alt="User photo"
                        className="nav__user-img"
                      />
                    ) : (
                      <span className="nav__user-img">
                        <ImageLoader />
                      </span>
                    )}
                  </>
                ) : (
                  <img src="/img/default.jpg" className="nav__user-img" />
                )}
                <span>{userInfo.name.split(" ")[0]}</span>
              </Link>
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
