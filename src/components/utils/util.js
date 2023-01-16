import { storage } from "./firebase";
import React, { useContext } from "react";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  uploadString,
} from "firebase/storage";

export const getLocaleDate = (date, options) => {
  return new Date(date).toLocaleString("en-us", options);
};

// {
//   month: "long",
//   year: "numeric",
//   day: "numeric",
// }

export const setLocalStorage = (key, user) => {
  const userData = {
    email: user.email,
    photo: user.photo,
    name: user.name,
    role: user.role,
  };

  localStorage.setItem(key, JSON.stringify(userData));
};

export const getFormInput = (setState, e) => {
  setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
};

export const clearInput = (state, setState) => {
  const newState = { ...state };
  Object.keys(state).map((key) => {
    newState[key] = "";
  });
  setState((prev) => ({ ...prev, ...newState }));
};

// export const BACKEND_URL = "https://tour-booking-server.vercel.app";
export const BACKEND_URL = "http://127.0.0.1:3000";

// export const setUserImage = (setState) => {
//   const imageListRef = ref(storage, "images/users/");
//   listAll(imageListRef).then((response) => {
//     response.items.forEach((item) => {
//       getDownloadURL(item).then((url) => {
//         const currUserPhoto = JSON.parse(localStorage.getItem("userData"));
//         const currImageRef = ref(storage, url);
//         if (currImageRef.name === currUserPhoto?.photo) {
//           setState(url);
//         }
//       });
//     });
//   });
// };
export const setUserImage = async (setState) => {
  const currUserPhoto = JSON.parse(localStorage.getItem("userData"));
  if (currUserPhoto.photo === "default.jpg") return;
  const imageRef = ref(storage, `images/users/${currUserPhoto.photo}`);
  const url = await getDownloadURL(imageRef);
  setState(url);
};

// user login context
export const UserContext = React.createContext();
export const UserProvider = UserContext.Provider;
