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
