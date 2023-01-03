import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getFormInput,
  clearInput,
  setLocalStorage,
  BACKEND_URL,
} from "./utils/util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ResetPassword = ({ Header, Footer }) => {
  useEffect(() => {
    document.title = "Natours | Reset your password";
  }, []);
  const [passwordInfo, setPasswordInfo] = useState({
    password: "",
    passwordConfirm: "",
  });
  const { token } = useParams();
  const resetPassword = async (e) => {
    if (!passwordInfo.password || !passwordInfo.passwordConfirm) {
      clearInput(passwordInfo, setPasswordInfo);
      toast.error("All fields are required!", {
        position: "top-center",
      });
      return;
    }
    e.target.textContent = "PROCESSING. . .";
    const res = await fetch(
      `${BACKEND_URL}/api/v1/users/resetPassword/${token}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordInfo),
      }
    );
    const d = await res.json();
    clearInput(passwordInfo, setPasswordInfo);
    if (d.status === "success") {
      toast.success(`${d.message}`, {
        position: "top-center",
        autoClose: false,
      });
      setLocalStorage("userData", d.user);
      setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      toast.error(`${d.message}`.split(":")[2], {
        position: "top-center",
      });
    }
    e.target.textContent = "RESET PASSWORD";
    // console.log(d);
    return;
  };
  return (
    <div>
      <Header />
      <main className="main" style={{ height: "100vh" }}>
        <div className="login-form">
          <h2 className="heading-secondary ma-bt-lg">Create new password</h2>
          <form className="form">
            <div className="form__group">
              <label className="form__label">Password</label>
              <input
                type="password"
                name="password"
                value={passwordInfo.password}
                onChange={(e) => {
                  getFormInput(setPasswordInfo, e);
                }}
                className="form__input"
                placeholder="********"
                required
              />
            </div>
            <div className="form__group">
              <label className="form__label">Confirm password</label>
              <input
                type="password"
                name="passwordConfirm"
                value={passwordInfo.passwordConfirm}
                onChange={(e) => {
                  getFormInput(setPasswordInfo, e);
                }}
                className="form__input"
                placeholder="********"
                required
              />
            </div>
            <div className="form__group">
              <a
                className="btn btn--green"
                style={{
                  display: "block",
                  width: "fit-content",
                  textAlign: "center",
                }}
                onClick={resetPassword}
              >
                RESET PASSWORD
              </a>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;
