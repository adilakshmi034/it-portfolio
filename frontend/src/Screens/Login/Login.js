import React, { useState, useEffect } from "react";
import "./Login.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import LOGO from "../../assets/IT Portfolio copy (1).jpg";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    if (savedRememberMe && savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const validateUsername = (value) => {
    if (!value) {
      setUsernameError("Username (email or mobile number) is required.");
    } else {
      setUsernameError("");
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Password is required.");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    validateUsername(username);
    validatePassword(password);

    if (usernameError || passwordError) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/clients/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
          },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(response.data);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errorData.message || "Invalid credentials. Please try again.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        const data = await response.json();

        // Store JWT in localStorage or sessionStorage
        localStorage.setItem("jwt", data.jwtToken);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("clients_Id", data.id || "");
        localStorage.setItem("fullName", data.fullName || "");
        localStorage.setItem("role", data.role || "");

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("username", username);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("username");
        }

        // Navigate to the appropriate dashboard
        switch (data.role) {
          case "ROLE_SUPERADMIN":
            navigate("/SuperAdminDashboard");
            break;
          case "ROLE_ADMIN":
            navigate("/AdminDashboard");
            break;
          case "ROLE_SALES":
            navigate("/SalesDashboard");
            break;
          default:
            navigate("http://localhost:3000/")
            break;
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
        timer: 2000,
        showConfirmButton: false,
      });
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={LOGO} alt="Logo" className="logo" />
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Email or Mobile Number"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                validateUsername(e.target.value);
              }}
              required
            />
            {usernameError && <div className="error-message">{usernameError}</div>}
          </div>

          <div className="form-group mb-4">
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                required
              />
              <div className="input-group-append">
                <button
                  className="btn"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                  ></i>
                </button>
              </div>
            </div>
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>

          <div className="remember-forgot">
            <a href="/ForgotPassword" className="forgot-password font-size-12">
              Forgot Password?
            </a>
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="button">
              <span>Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default LoginPage;
