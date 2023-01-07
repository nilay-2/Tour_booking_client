import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFormInput, clearInput, setLocalStorage } from "./utils/util";
import { BACKEND_URL, setUserImage } from "./utils/util";
import { storage } from "./utils/firebase";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  uploadString,
  deleteObject,
} from "firebase/storage";

const Account = ({ Loader, Error, ImageLoader }) => {
  const [user, setUser] = useState();
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState(
    localStorage.getItem("userData")
      ? { name: JSON.parse(localStorage.getItem("userData")).name }
      : { name: "" }
  );
  const [email, setEmail] = useState(
    localStorage.getItem("userData")
      ? { email: JSON.parse(localStorage.getItem("userData")).email }
      : { email: "" }
  );
  const [userPass, setUserPass] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });
  const [imageFileName, setImageFileName] = useState("");
  const [imageURL, setImageURL] = useState("");
  // firebase imageList reference to access all images

  useEffect(() => {
    document.title = "Natours | Your account settings";
    if (localStorage.getItem("userData")) {
      setUser(JSON.parse(localStorage.getItem("userData")));
      setIsLoading(false);
    }
    setUserImage(setImageURL);
  }, []);
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

  // get user photo
  const getUserPhoto = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // update user data
  const submitUserData = async (e) => {
    e.preventDefault();
    e.target.textContent = "updating...";
    if (!name.name || !email.email) {
      toast.error("Email and username are required!");
      return;
    }
    const dataObj = { name: name.name, email: email.email };
    if (file) {
      const fileName = `user-${email.email}-${Date.now()}.jpeg`;
      setImageFileName(fileName);
      dataObj.photo = fileName;
      // firebase image reference
      // const resizedFile = await resizeFile(file);
      const imageRef = ref(storage, `images/users/${fileName}`);
      uploadBytes(imageRef, file);
      // uploadString(imageRef, resizedFile, "data_url");
    }
    const res = await fetch(`${BACKEND_URL}/api/v1/users/updateMe`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(dataObj),
    });

    const data = await res.json();
    e.target.textContent = "save settings";
    if (data.status === "success") {
      setLocalStorage("userData", data.updatedUser);
      toast.success("Updated successfully!", {
        autoClose: false,
      });
      setTimeout(() => {
        location.reload(true);
      }, 1000);
    } else {
      toast.error("Error occurred while updating user info!");
    }
    // console.log(data);
    return;
  };

  // delete user profile image
  const deleteProfilePic = async (e) => {
    e.preventDefault();
    console.log(imageURL);
    const imageRef = ref(storage, imageURL);
    deleteObject(imageRef).then(() => {
      console.log("image delete successfully!");
    });
    const res = await fetch(`${BACKEND_URL}/api/v1/users/deleteProfilePic`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        name: name.name,
        email: email.email,
        photo: "default.jpg",
      }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setLocalStorage("userData", data.updatedUser);
      toast.success("Deleted successfully!", {
        autoClose: false,
      });
      setTimeout(() => {
        location.reload(true);
      }, 1000);
    } else {
      toast.error("Error occurred while updating user info!");
    }
    return;
  };
  if (!user) {
    return <Error msg="You are not logged in! Please log in to get access" />;
  } else if (!isLoading) {
    return (
      <>
        {/*<Header />*/}
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
                  <Link to="/myTourBookings">
                    <svg>
                      <use href="/img/icons.svg#icon-briefcase"></use>
                    </svg>
                    My bookings
                  </Link>
                </li>
                <li>
                  <Link to="/myReviews">
                    <svg>
                      <use href="/img/icons.svg#icon-star"></use>
                    </svg>
                    My reviews
                  </Link>
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
                      className="form__input"
                      id="name"
                      type="text"
                      name="name"
                      required
                      placeholder="Name"
                      defaultValue={user.name}
                      onChange={(e) => {
                        getFormInput(setName, e);
                      }}
                    />
                  </div>
                  <div className="form__group ma-bt-md">
                    <label className="form__label" htmlFor="email">
                      Email address
                    </label>
                    <input
                      className="form__input"
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Email"
                      defaultValue={user.email}
                      onChange={(e) => {
                        getFormInput(setEmail, e);
                      }}
                    />
                  </div>
                  <div className="form__group form__photo-upload">
                    {user.photo != "default.jpg" ? (
                      <>
                        {imageURL != "" ? (
                          <img
                            className="form__user-photo"
                            src={`${imageURL}`}
                            alt="User photo"
                          />
                        ) : (
                          <div className="form__user-photo-loader">
                            <ImageLoader />
                          </div>
                        )}
                      </>
                    ) : (
                      <img
                        className="form__user-photo"
                        src="/img/default.jpg"
                      />
                    )}
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
                        onClick={deleteProfilePic}
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
        {/*<Footer />*/}
      </>
    );
  } else {
    return <Loader />;
  }
};

export default Account;
