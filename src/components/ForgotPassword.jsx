import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFormInput, clearInput } from "./utils/util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ForgotPassword = ({ Header, Footer }) => {
  useEffect(() => {
    document.title = "Natours | Get password reset link";
  }, []);
  const [email, setEmail] = useState({ email: "" });
  const submitData = async (e) => {
    if (email.email === "") {
      toast.error("Please enter your email address", {
        position: "top-center",
      });
      return;
    }
    e.target.textContent = "PROCESSING...";
    const myPromise = new Promise(async function (resolve, reject) {
      const res = await fetch(
        "http://127.0.0.1:3000/api/v1/users/forgetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        }
      );
      const d = await res.json();
      if (d.status === "success") {
        clearInput(email, setEmail);
        resolve(d.message);
      } else {
        clearInput(email, setEmail);
        reject(d.message);
      }
      e.target.textContent = "SUBMIT";
    });
    toast.promise(myPromise, {
      pending: "Email is being sent",
      success: "Please check your inbox",
      error: "Error occured while sending email, please try again later!",
    });
  };
  return (
    <div>
      <Header />
      <main className="main" style={{ height: "100vh" }}>
        <div style={{ margin: "15px 0px 15px 0px", fontSize: "1.8em" }}>
          <Link to="/login" style={{ marginRight: "10px" }}>
            Login
          </Link>
          |
          <Link to="/signup" style={{ marginLeft: "10px" }}>
            Sign Up
          </Link>
        </div>
        <div className="login-form">
          <h2 className="heading-secondary ma-bt-lg">Enter email address</h2>
          <form className="form">
            <div className="form__group">
              <label className="form__label">Email address</label>
              <input
                type="email"
                name="email"
                className="form__input"
                placeholder="you@example.com"
                value={email.email}
                onChange={(e) => {
                  getFormInput(setEmail, e);
                }}
                required
              />
            </div>
            <div className="form__group">
              <a
                className="btn btn--green"
                style={{
                  display: "block",
                  width: "12em",
                  textAlign: "center",
                }}
                onClick={submitData}
              >
                SUBMIT
              </a>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
