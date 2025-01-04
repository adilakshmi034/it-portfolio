import React, { useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../../axiosInstance";
const AddSale = ({ superAdminId }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [errors, setErrors] = useState({});
  const storedId = localStorage.getItem("clients_Id");

  const validateField = (name, value) => {
    let error = "";

    if (name === "fullName") {
      if (!value.trim()) {
        error = "Full name is required.";
      } else if (value.length < 3) {
        error = "Full name must be at least 3 characters.";

      }
    }

    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required.";
      } else if (!/^\S+@gmail\.com$/.test(value)) {
        error = "Invalid email format. Use a Gmail address.";
      }
    }

    if (name === "mobileNumber") {
      if (!value.trim()) {
        error = "Mobile number is required.";
      } else if (!/^[1-9][0-9]{9}$/.test(value)) {
        error = "Enter a valid mobile number.";
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Dynamically update state based on input field
    if (name === "fullName") setFullName(value);
    if (name === "email") setEmail(value);
    if (name === "mobileNumber") setMobileNumber(value);

    // Validate the current field
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check for validation errors
    if (Object.values(errors).some((error) => error) || !fullName || !email || !mobileNumber) {
      Swal.fire({
        title: "Validation Error",
        text: "Please correct the highlighted fields.",
        icon: "error",
        // confirmButtonText: "OK",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
  
    try {
      // Make the API request
      const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/clients/saveAdminSales/${storedId}`,
        {
          fullName,
          email,
          mobileNumber,
          role:"ROLE_SALES",
        }
      );
  
      // Check if the response status indicates success
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "sale created successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
  
        // Reset form fields
        setFullName("");
        setEmail("");
        setMobileNumber("");
        setErrors({});
      } else {
        Swal.fire({
          title: "Unexpected Error",
          text: "Unexpected response from the server. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      // Log the error for debugging
      console.error("API Error:", error);
  
      // Provide a user-friendly error message
      Swal.fire({
        title: "Something went wrong!!",
        text:
        error?.response?.data|| error?.response?.data?.message ||
          "Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-12 col-md-10 col-lg-10 col-xl-8 col-xxl-8">
          <div className="card">
            <div className="card-body mt-3">
              <h2 className="mb-4 text-center">Create Sales</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className={`form-control mb-1 ${
                      errors.fullName ? "is-invalid" : ""
                    }`}
                    placeholder="Enter Full Name"
                    value={fullName}
                    onChange={handleInputChange}
                  />
                  {errors.fullName && (
                    <div className="invalid-feedback">{errors.fullName}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control mb-1 ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter Email"
                    value={email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="mobileNumber" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="text"
                    className={`form-control mb-1 ${
                      errors.mobileNumber ? "is-invalid" : ""
                    }`}
                    placeholder="Enter Mobile Number"
                    value={mobileNumber}
                    onChange={handleInputChange}
                  />
                  {errors.mobileNumber && (
                    <div className="invalid-feedback">{errors.mobileNumber}</div>
                  )}
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn submit_button mt-4 w-auto mb-4"
                  >
                    <span>Create Sales</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSale;
