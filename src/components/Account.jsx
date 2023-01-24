import { useEffect, useState, useContext, useRef, createElement } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getFormInput,
  clearInput,
  BACKEND_URL,
  UserContext,
} from "./utils/util";
import { storage } from "./utils/firebase";
import b64toBlob from "b64-to-blob";
import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
const Account = ({ Loader, Error, ImageLoader }) => {
  const { data, imageURL, updateUser, updateImage } = useContext(UserContext);
  // console.log(data);
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [btnProcessing, setBtnProcessing] = useState(false);
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
  const itemRef = useRef([]);
  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
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
    // console.log(e.target.files[0]);
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
      updateUser(data.updatedUser);
      toast.success("Updated successfully!");
    } else {
      toast.error("Error occurred while updating user info!");
    }
    return;
  };

  // upload profile image
  const uploadImage = async (e) => {
    setBtnProcessing(true);
    if (!file) {
      toast.error("No file selected!");
      setBtnProcessing(false);
      return;
    }
    const formData = new FormData();
    formData.append("photo", file);
    const res = await fetch(`${BACKEND_URL}/api/v1/users/uploadProfileImage`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: formData,
    });
    const data = await res.json();
    if (data.status === "success") {
      let imageObj;
      const { bufferData, updatedUser } = data;
      const blob = b64toBlob(bufferData.b64data, bufferData.contentType);
      const imageRef = ref(storage, `images/users/${bufferData.fileName}`);
      uploadBytes(imageRef, blob).then(() => {
        getDownloadURL(imageRef).then(async (url) => {
          updateImage(url);
          const newObj = { ...updatedUser };
          newObj.photo = url;
          const saveImage = await fetch(
            `${BACKEND_URL}/api/v1/users/updateMe`,
            {
              method: "PATCH",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newObj),
            }
          );
          const imageRes = await saveImage.json();
          const { updatedUser: firebaseImg } = imageRes;
          // imageObj = { ...firebaseImg };
          updateUser(firebaseImg);
          toast.success("Image updated successfully", {
            position: "top-center",
          });
          setBtnProcessing(false);
        });
      });
    } else {
      toast.error("Error occurred while upload image");
    }
    return;
  };
  console.log(data.photo);
  // delete user profile image
  const deleteProfilePic = async (e) => {
    setBtnProcessing(true);
    console.log("imageURL for deleting", data.photo);
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
      updateUser(data.updatedUser);
      setBtnProcessing(false);
      toast.success("Deleted successfully!");
    } else {
      toast.error("Error occurred while updating user info!");
    }
    return;
  };
  if (data === null || data === undefined) {
    return <Error msg="You are not logged in! Please log in to get access" />;
  } else {
    return (
      <>
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
              {data?.role === "admin" ? (
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
                <div className="form__group form__photo-upload">
                  {data?.photo !== "default.jpg" ? (
                    <>
                      {data?.photo != "" ? (
                        <img
                          className="form__user-photo"
                          src={`${data.photo}`}
                          alt="User photo"
                        />
                      ) : (
                        <div className="form__user-photo-loader">
                          <ImageLoader />
                        </div>
                      )}
                    </>
                  ) : (
                    <img className="form__user-photo" src="/img/default.jpg" />
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
                  <div className="btn_div">
                    <button
                      disabled={btnProcessing}
                      className={`btn-upload ${btnProcessing ? "" : "active"}`}
                      onClick={uploadImage}
                      ref={(el) => (itemRef.current[0] = el)}
                    >
                      {!btnProcessing ? (
                        <>
                          <i className="bi bi-upload"></i>
                          <span className="span-upload">upload</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-arrow-clockwise btn-spinner"></i>
                          <span className="span-upload">uploading</span>
                        </>
                      )}
                    </button>
                    {data?.photo === "default.jpg" ? (
                      <button
                        className="btn-delete"
                        onClick={deleteProfilePic}
                        disabled
                      >
                        <i className="bi bi-trash3-fill"></i>
                        <span className="span-upload">Delete</span>
                      </button>
                    ) : (
                      <button
                        disabled={btnProcessing}
                        className="btn-delete active"
                        onClick={deleteProfilePic}
                        ref={(el) => (itemRef.current[0] = el)}
                      >
                        {!btnProcessing ? (
                          <>
                            {" "}
                            <i className="bi bi-trash3-fill"></i>
                            <span className="span-upload">Delete</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-arrow-clockwise btn-spinner"></i>
                            <span className="span-upload">uploading</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

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
                      defaultValue={data?.name}
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
                      defaultValue={data?.email}
                      onChange={(e) => {
                        getFormInput(setEmail, e);
                      }}
                    />
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
      </>
    );
  }
};

export default Account;
