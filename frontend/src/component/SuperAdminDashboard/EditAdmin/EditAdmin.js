import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import '../AddAdmin/AddAdmin.css';
import axiosInstance from "../../../axiosInstance";
const EditAdmin = () => {
  const navigate = useNavigate();
  const { id: adminId } = useParams();

  const [adminDetails, setAdminDetails] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (adminId) {
      axiosInstance
        .get(`${process.env.REACT_APP_API_URL}/api/clients/getall/${adminId}`)
        .then((response) => {
          setAdminDetails(response.data);
        })
        .catch((error) => {
          setError("Failed to fetch admin details.");
          console.error("Error fetching admin details:", error);
        });
    } else {
      console.error("adminId is undefined");
    }
  }, [adminId]);

  const validateField = (field, value) => {
    let errorMessage = "";

    switch (field) {
      case "fullName":
        if (!value.trim()) {
          errorMessage = "Full name is required.";
        } else if (value.trim().length < 3) {
          errorMessage = "Full name must be at least 3 characters.";
        }
        break;
      case "email":
        if (!value.trim()) {
          errorMessage = "Email is required.";
        } else if (!/^\S+@gmail\.com$/.test(value.trim())) {
          errorMessage = "Invalid email format.";
        }
        break;
      case "mobileNumber":
        const mobile = value.toString(); // Convert to string just in case
        if (!mobile.trim()) {
          errorMessage = "Mobile number is required.";
        } else if (!/^[1-9][0-9]{9}$/.test(mobile.trim())) {
          errorMessage = "Enter a valid mobile number.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorMessage,
    }));

    return errorMessage === ""; // Return true if no error
  };

  const validate = () => {
    const fieldErrors = {};
    let isValid = true;

    Object.keys(adminDetails).forEach((field) => {
      const value = adminDetails[field];
      const fieldIsValid = validateField(field, value);
      if (!fieldIsValid) {
        isValid = false;
        fieldErrors[field] = errors[field];
      }
    });

    setErrors(fieldErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAdminDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    // Validate the field in real time
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return; // Validate all fields before submission

    setLoading(true);

    axiosInstance
      .put(`${process.env.REACT_APP_API_URL}/api/clients/update/${adminId}`, adminDetails)
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: "Admin details updated successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          navigate("/SuperAdminDashboard/adminlist");
        });
      })
      .catch((error) => {
        const errorMessage =
          error?.response?.data?.message || "Failed to update admin. Please try again.";
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
        console.error("Error updating admin details:", error);
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-12 col-md-10 col-lg-10 col-xl-8 col-xxl-8">
          <div className="card">
            <div className="card-body">
              <h2 className="mb-4 text-center">Edit Admin</h2>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                    value={adminDetails.fullName}
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
                    value={adminDetails.email}
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
                    value={adminDetails.mobileNumber}
                    onChange={handleChange}
                  />
                  {errors.mobileNumber && (
                    <div className="invalid-feedback">{errors.mobileNumber}</div>
                  )}
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn submit_button mt-3 w-auto" disabled={loading}>
                   <span> {loading ? "Updating..." : "Update Admin"}</span>
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

export default EditAdmin;
