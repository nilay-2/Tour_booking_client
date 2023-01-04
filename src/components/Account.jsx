import { useEffect, useState } from "react";
import { setLocalStorage } from "./utils/util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFormInput, clearInput } from "./utils/util";
import { BACKEND_URL } from "./utils/util";
const Account = ({ Header, Footer, Loader, Error }) => {
  const [user, setUser] = useState();
  const [file, setFile] = useState();
  const [data, setData] = useState({
    name: `${
      JSON.parse(localStorage.getItem("userData"))
        ? JSON.parse(localStorage.getItem("userData")).name
        : ""
    }`,
    email: `${
      JSON.parse(localStorage.getItem("userData"))
        ? JSON.parse(localStorage.getItem("userData")).email
        : ""
    }`,
  });
  const [userPass, setUserPass] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });

  const getUserPhoto = (e) => {
    setFile(e.target.files[0]);
  };

  // clear password inputs

  // user password update
  const updateUserPass = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BACKEND_URL}/api/v1/users/updatePassword`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPass),
    });
    const d = await res.json();
    // console.log(d);
    if (d.status === "success") {
      toast.success(`${d.message}`, {
        position: "top-center",
        autoClose: false,
      });
    } else {
      toast.error(`${d.message}`, {
        position: "top-center",
        autoClose: false,
      });
    }
    clearInput(userPass, setUserPass);
    return;
  };
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    document.title = "Natours | Your account settings";
    if (localStorage.getItem("userData")) {
      setUser(JSON.parse(localStorage.getItem("userData")));
      setIsLoading(false);
    }
  }, []);

  // delete user profile image
  const deleteUserPhoto = async (e) => {
    e.preventDefault();
    if (user.photo === "default.jpg") {
      toast.error("There is no profile image.", {
        position: "top-center",
        autoClose: false,
      });
      return;
    }
    const obj = {
      photo: `default.jpg`,
    };
    if (!user.photo.startsWith("default")) {
      obj.fileDelete = user.photo;
    }
    const res = await fetch(`${BACKEND_URL}/api/v1/users/deleteProfilePic`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const d = await res.json();
    if (d.status === "success") {
      setLocalStorage("userData", d.updatedUser);
      toast.success("Profile picture removed successfully.", {
        position: "top-center",
      });
      setTimeout(() => {
        location.reload(true);
      }, 2000);
    } else {
      toast.error(`${d.message}`);
    }
    return;
  };

  // user data
  const submitUserData = async (e) => {
    e.preventDefault();
    e.target.textContent = "UPDATING...";
    const form = new FormData();
    form.append("name", data.name);
    form.append("email", data.email);
    if (file) {
      form.append("photo", file);
      form.append("fileDelete", user.photo);
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/users/updateMe`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      },
      body: form,
    });
    const d = await res.json();
    // console.log(d);
    if (d.status === "success") {
      setLocalStorage("userData", d.updatedUser);
      toast.success(`Updated successfully`, {
        position: "top-center",
      });
      setTimeout(() => {
        location.reload(true);
      }, 2000);
    } else {
      toast.error(`${d.message}`);
    }
    return;
  };
  if (!user) {
    return (
      <Error
        Header={Header}
        Footer={Footer}
        msg="You are not logged in! Please log in to get access"
      />
    );
  } else if (!isLoading) {
    return (
      <>
        <ToastContainer />
        <Header />
        <main className="main">
          <div className="user-view">
            <nav className="user-view__menu">
              <ul className="side-nav">
                <li className="side-nav--active">
                  <a href="#">
                    <svg>
                      <use href="/img/icons.svg#icon-settings"></use>
                    </svg>
                    Settings
                  </a>
                </li>
                <li>
                  <a href="/myTourBookings">
                    <svg>
                      <use href="/img/icons.svg#icon-briefcase"></use>
                    </svg>
                    My bookings
                  </a>
                </li>
                <li>
                  <a href="/myReviews">
                    <svg>
                      <use href="/img/icons.svg#icon-star"></use>
                    </svg>
                    My reviews
                  </a>
                </li>
                <li>
                  <a href="#">
                    <svg>
                      <use href="/img/icons.svg#icon-credit-card"></use>
                    </svg>
                    Billing
                  </a>
                </li>
              </ul>
              {user.role === "admin" ? (
                <div className="admin-nav">
                  <h5 className="admin-nav__heading">Admin</h5>
                  <ul className="side-nav">
                    <li>
                      <a href="#">
                        <svg>
                          <use href="/img/icons.svg#icon-map"></use>
                        </svg>
                        Manage tours
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <svg>
                          <use href="/img/icons.svg#icon-users"></use>
                        </svg>
                        Manage users
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <svg>
                          <use href="/img/icons.svg#icon-star"></use>
                        </svg>
                        Manage reviews
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <svg>
                          <use href="/img/icons.svg#icon-briefcase"></use>
                        </svg>
                        Manage Bookings
                      </a>
                    </li>
                  </ul>
                </div>
              ) : (
                ""
              )}
            </nav>
            <div className="user-view__content">
              <div className="user-view__form-container">
                <h2 className="heading-secondary ma-bt-md">
                  Your account settings
                </h2>
                <form className="form form-user-data">
                  <div className="form__group">
                    <label className="form__label" htmlFor="name">
                      Name
                    </label>
                    <input
                      value={data.name}
                      className="form__input"
                      id="name"
                      type="text"
                      name="name"
                      required
                      placeholder="Name"
                      onChange={(e) => {
                        getFormInput(setData, e);
                      }}
                    />
                  </div>
                  <div className="form__group ma-bt-md">
                    <label className="form__label" htmlFor="email">
                      Email address
                    </label>
                    <input
                      value={data.email}
                      className="form__input"
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Email"
                      onChange={(e) => {
                        getFormInput(setData, e);
                      }}
                    />
                  </div>
                  <div className="form__group form__photo-upload">
                    <img
                      className="form__user-photo"
                      src={`${BACKEND_URL}/img/users/${user.photo}`}
                      alt="User photo"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="photo"
                      name="photo"
                      className="form__upload"
                      onChange={getUserPhoto}
                    />
                    <label htmlFor="photo">Choose new photo</label>
                    <div className="remove--pic">
                      <button
                        className="btn btn--small btn--red"
                        onClick={deleteUserPhoto}
                      >
                        Discard image
                      </button>
                    </div>
                  </div>
                  <div className="form__group right">
                    <button
                      className="btn btn--small btn--green"
                      onClick={submitUserData}
                    >
                      Save settings
                    </button>
                  </div>
                </form>
              </div>
              <div className="line">&nbsp;</div>
              <div className="user-view__form-container">
                <h2 className="heading-secondary ma-bt-md">Password change</h2>
                <form className="form form-user-settings">
                  <div className="form__group">
                    <label className="form__label" htmlFor="password-current">
                      Current password
                    </label>
                    <input
                      className="form__input"
                      id="password-current"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength="8"
                      value={userPass.passwordCurrent}
                      name="passwordCurrent"
                      onChange={(e) => getFormInput(setUserPass, e)}
                    />
                  </div>
                  <div className="form__group">
                    <label className="form__label" htmlFor="password">
                      New password
                    </label>
                    <input
                      className="form__input"
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength="8"
                      value={userPass.password}
                      name="password"
                      onChange={(e) => getFormInput(setUserPass, e)}
                    />
                  </div>
                  <div className="form__group ma-bt-lg">
                    <label className="form__label" htmlFor="password-confirm">
                      Confirm password
                    </label>
                    <input
                      className="form__input"
                      id="password-confirm"
                      type="password"
                      placeholder="••••••••"
                      required
                      minLength="8"
                      value={userPass.passwordConfirm}
                      name="passwordConfirm"
                      onChange={(e) => getFormInput(setUserPass, e)}
                    />
                  </div>
                  <div className="form__group right">
                    <button
                      className="btn btn--small btn--green"
                      onClick={updateUserPass}
                    >
                      Save password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Account;
