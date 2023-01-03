import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getFormInput,
  clearInput,
  setLocalStorage,
  BACKEND_URL,
} from "./utils/util";
const SignUp = ({ Header, Footer }) => {
  useEffect(() => {
    document.title = "Natours | Create an account";
  }, []);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const submitData = async (e) => {
    e.target.textContent = "PROCESSING...";
    const res = await fetch(`${BACKEND_URL}/api/v1/users/signup`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const d = await res.json();
    clearInput(data, setData);
    if (d.status === "success") {
      e.target.textContent = "SIGN UP";
      setLocalStorage("userData", d.user);
      toast.success("Account created successfully!", {
        position: "top-center",
        autoClose: false,
      });
      setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      e.target.textContent = "SIGN UP";
      toast.error(`${d.message}`.split(":")[2], {
        position: "top-center",
        autoClose: false,
      });
    }
    return;
  };
  return (
    <>
      <Header />
      <main className="main">
        <div className="login-form">
          <h2 className="heading-secondary ma-bt-lg">Create an account</h2>
          <form className="form">
            <div className="form__group">
              <label className="form__label">Name</label>
              <input
                type="text"
                name="name"
                className="form__input"
                placeholder="john doe"
                value={data.name}
                onChange={(e) => {
                  getFormInput(setData, e);
                }}
                required
              />
            </div>
            <div className="form__group">
              <label className="form__label">Email address</label>
              <input
                type="email"
                name="email"
                className="form__input"
                placeholder="you@example.com"
                value={data.email}
                onChange={(e) => {
                  getFormInput(setData, e);
                }}
                required
              />
            </div>
            <div className="form__group ma-bt-md">
              <label className="form__label">Password</label>
              <input
                type="password"
                name="password"
                className="form__input"
                placeholder="********"
                value={data.password}
                onChange={(e) => {
                  getFormInput(setData, e);
                }}
                required
                minLength={8}
              />
            </div>
            <div className="form__group ma-bt-md">
              <label className="form__label">Confirm password</label>
              <input
                type="password"
                name="passwordConfirm"
                className="form__input"
                placeholder="********"
                value={data.passwordConfirm}
                onChange={(e) => {
                  getFormInput(setData, e);
                }}
                required
                minLength={8}
              />
            </div>
            <div className="form__group">
              <a
                className="btn btn--green"
                style={{
                  display: "block",
                  margin: "auto",
                  width: "12em",
                  textAlign: "center",
                }}
                onClick={submitData}
              >
                SIGN UP
              </a>
            </div>
          </form>
          <div
            style={{
              marginTop: "12px",
              fontSize: "1.5em",
              textAlign: "center",
            }}
          >
            Already have an account? | <Link to="/login">LOGIN</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SignUp;
