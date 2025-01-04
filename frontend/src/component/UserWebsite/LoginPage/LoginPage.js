import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import LOGO from "../../../assets/IT Portfolio copy (1).jpg";

function LoginUser() {
  const [emailOrMobileNumber, setEmailOrMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = location.state || {};  // productId from location state

  const handleLogin = async (e) => {
    e.preventDefault();

    // API request to login
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/superadmin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          emailOrMobileNumber,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: errorData.error || "Login failed. Please try again.",
        });
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have successfully logged in!",
        });

        // Fetching roles for the specific product
        if (productId) {
          try {
            const categoryResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/category/all`);
            const categoryData = await categoryResponse.json();

            let roles = [];
            // Searching for the product in categories and subcategories
            for (const category of categoryData) {
              for (const subCategory of category.subcategories) {
                const product = subCategory.products.find(
                  (product) => product.productId === parseInt(productId)
                );
                if (product) {
                  roles = product.roles || [];  // Assuming roles are part of the product data
                  break;
                }
              }
            }

            if (roles.length > 0) {
              navigate(`/ProductRole/${productId}/roles`, { state: { roles } });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No roles found for this product.",
              });
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to fetch roles for the product.",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Product ID not found. Unable to fetch roles.",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again.",
      });
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
              className={`toggle-password fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
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
      </div>
    </div>
  );
}

export default LoginUser;
