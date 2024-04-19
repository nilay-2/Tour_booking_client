import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setLocalStorage, UserContext } from "./utils/util";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFormInput, clearInput, BACKEND_URL } from "./utils/util";
import { getAccessControlAllowOrigin } from "./utils/util";
const Login = () => {
  const { updateUser } = useContext(UserContext);
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Natours | Log into your account";
  }, []);
  const sendData = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BACKEND_URL}/api/v1/users/login`, {
      method: "post",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": getAccessControlAllowOrigin(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const d = await res.json();
    if (d.status === "success") {
      clearInput(data, setData);
      toast.success("Login successful", {
        position: "top-center",
      });
      // setLocalStorage("userData", d.user);
      updateUser(d.user);
      navigate("/");
      // setTimeout(() => {
      //   location.assign("/");
      // }, 1500);
    } else {
      toast.error(`${d.message}`, {
        position: "top-center",
      });
      clearInput(data, setData);
    }
  };

  return (
    <div>
      {/*<ToastContainer />*/}
      {/*<Header />*/}
      <main className="main">
        <div className="login-form">
          <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
          <form className="form">
            <div className="form__group">
              <label className="form__label">Email address</label>
              <input
                type="email"
                id="email"
                value={data.email}
                name="email"
                onChange={(e) => {
                  getFormInput(setData, e);
                }}
                className="form__input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form__group ma-bt-md">
              <label className="form__label">Password</label>
              <input
                type="password"
                id="password"
                value={data.password}
                name="password"
                onChange={(e) => {
                  getFormInput(setData, e);
                }}
                className="form__input"
                placeholder="********"
                required
                minLength={8}
              />
            </div>
            <div
              className="form__group"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <a
                className="btn btn--green"
                onClick={sendData}
                style={{
                  display: "block",
                  width: "9em",
                  textAlign: "center",
                }}
              >
                Login
              </a>
              <Link to="/forgotPassword" style={{ fontSize: "1.6em" }}>
                Forgot password?
              </Link>
            </div>
          </form>
          <div
            style={{
              marginTop: "30px",
              fontSize: "1.5em",
              textAlign: "center",
            }}
          >
            Don't have an account? | <Link to="/signup">SIGN UP</Link>
          </div>
        </div>
      </main>
      {/*<Footer />*/}
    </div>
  );
};

export default Login;
