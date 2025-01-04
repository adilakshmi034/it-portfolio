import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";
import Swal from "sweetalert2";
import "../AddAdmin/AddAdmin.css";

const EditSale = () => {
  const navigate = useNavigate();
  const { id: salesId } = useParams();

  const [sales, setSales] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (salesId) {
      axiosInstance`A`
        .get(`${process.env.REACT_APP_API_URL}/api/clients/getall/${salesId}`)
        .then((response) => {
          setSales(response.data);
        })
        .catch((error) => {
          setError("Failed to fetch sales details.");
          console.error("Error fetching sales details:", error);
        });
    } else {
      console.error("salesId is undefined");
    }
  }, [salesId]);

  const validateField = (name, value) => {
    let error = "";
    const trimmedValue = String(value).trim(); // Ensure value is treated as a string and trimmed
  
    if (name === "fullName") {
      if (!trimmedValue) {
        error = "Full name is required.";
      } else if (trimmedValue.length < 3) {
        error = "Full name must be at least 3 characters.";
      }
    }
  
    if (name === "email") {
      if (!trimmedValue) {
        error = "Email is required.";
      } else if (!/^\S+@gmail\.com$/.test(trimmedValue)) {
        error = "Invalid email format.";
      }
    }
  
    if (name === "mobileNumber") {
      if (!trimmedValue) {
        error = "Mobile number is required.";
      } else if (!/^[1-9][0-9]{9}$/.test(trimmedValue)) {
        error = "Enter a valid mobile number.";
      }
    }
  
    return error;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the sales state
    setSales((prevSales) => ({
      ...prevSales,
      [name]: value,
    }));

    // Validate the field and update errors
    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors = {};
    Object.keys(sales).forEach((key) => {
      const error = validateField(key, sales[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        title: "Validation Error",
        text: "Please correct the highlighted fields.",
        icon: "error",
        showConfirmButton: false,
        timer: 1000,
        // confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);

    axiosInstance
      .put(`${process.env.REACT_APP_API_URL}/api/clients/update/${salesId}`, sales)
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: "Sales details updated successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          navigate(-1); // Navigate back to the previous screen after success
        });
      })
      .catch((error) => {
        const errorMessage =
          error?.response?.data?.message || "Failed to update sales. Please try again.";
        Swal.fire({
          title: "Something went happened!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
        console.error("Error updating sales details:", error);
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-12 col-md-10 col-lg-10 col-xl-8 col-xxl-8">
          <div className="card">
            <div className="card-body">
              <h2 className="mb-4 text-center">Edit Sale</h2>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                    value={sales.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={sales.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    className={`form-control ${errors.mobileNumber ? "is-invalid" : ""}`}
                    value={sales.mobileNumber}
                    onChange={handleChange}
                  />
                  {errors.mobileNumber && (
                    <div className="invalid-feedback">{errors.mobileNumber}</div>
                  )}
                </div>

                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn submit_button mt-3 w-auto" disabled={loading}>
                    <span>{loading ? "Updating..." : "Update Sale"}</span>
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

export default EditSale;
