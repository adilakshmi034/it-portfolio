import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import LOGO from "../../../assets/IT Portfolio copy (1).jpg";

function Logins() {
  const [emailOrMobileNumber, setEmailOrMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(""); // To display the user's name after login
  const navigate = useNavigate();

  // Check login state on component mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedName = localStorage.getItem("fullName");
    if (loggedIn) {
      setIsLoggedIn(true);
      setUserName(storedName || "User");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/superadmin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            emailOrMobileNumber,
            password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errorData.error || "Login failed. Please try again.",
        });
      } else {
        const data = await response.json();
        console.log("Login successful:", data);

        // Save user data to localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user_id", data.user_id || "");
        localStorage.setItem("super_admin_Id", data.id || "");
        localStorage.setItem("fullName", data.fullName || "User");
        localStorage.setItem("role", data.role || "");
        localStorage.setItem("sales_id", data.sales_Id || "");
        localStorage.setItem("admin_Id", data.admin_Id || "");

        // Update state to show logged-in UI
        setIsLoggedIn(true);
        setUserName(data.fullName || "User");

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have successfully logged in!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again.",
      });
      console.error("Login error:", error);
    }
  };

  const handleOkay = () => {
    navigate("/"); // Redirect to the user website's homepage
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={LOGO} alt="Logo" className="logo" />
        </div>

        {!isLoggedIn ? (
          <form onSubmit={handleLogin}>
            <div className="form-group mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Email or Mobile Number"
                value={emailOrMobileNumber}
                onChange={(e) => setEmailOrMobileNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group password-group mb-4">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i
                className={`toggle-password fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                }`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="remember-forgot">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span> Remember Me
              </label>
              <a href="/ForgotPassword" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <div className="d-flex justify-content-center">
              <button type="submit" className="button">
                <span>Login</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="welcome-box">
            <h2>Welcome, {userName}!</h2>
            <p>You are now logged in.</p>
            <button onClick={handleOkay} className="button okay-btn">
              Okay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Logins;
