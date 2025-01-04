import React, { useState } from "react";
import "./ForgotPassword.css"; // Ensure this path is correct for your project
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import LOGO from "../../assets/IT Portfolio copy (1).jpg";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");

  // Email validation function
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
      setEmailError("Email is required.");
    } else if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email.");
    } else {
      setEmailError("");  // Clear error if email is valid
    }
  };


  const handleResetPassword = async (e) => {
    e.preventDefault();
    validateEmail(email);
    if (emailError) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/superadmin/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Reset Failed",
          text: "Failed to send reset link. Please try again.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Reset Link Sent",
          text: "A reset link has been sent to your email!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went happened!!",
        text: "Please try again.",
      });
      console.error("Reset password error:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo Section */}
        <div className="login-header">
          <img src={LOGO} alt="Logo" className="logo" />
        </div>

        <div >
          <p className="reset-password-message">Enter your email, we will send a link to reset your password</p>
        </div>

        <form onSubmit={handleResetPassword}>
          {/* Email Input */}
          <div className="form-group mb-4">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              required
            />
            {emailError && <div className="error-message">{emailError}</div>}  {/* Display error message */}
          </div>

          {/* Reset Button */}
          <div className="d-flex justify-content-center">
            <button type="submit" className="button w-auto" >
            <span>Reset Password</span>
            </button>
          </div>
        </form>

        {/* Return to Login Link */}
        <div className="return-to-login">
          <a routerLink="/login" onClick={() => navigate("/login")} className="forgot-password">
            Return to Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
