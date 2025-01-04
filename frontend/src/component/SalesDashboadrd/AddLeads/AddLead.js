import React, { useState } from "react";
import axiosInstance from "../../../axiosInstance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Enum-like array for SalesStatus
const salesStatusOptions = [
  "LEAD_GENERATION",
  "CONTRACT_SIGNING",
  "LEAD_QUALIFICATION",
  "LEAD_INITIAL_CONTACT",
  "LEAD_PROPOSAL",
  "NEGOTIATION",
  "LEAD_CLOSING",
  "LEAD_ONBOARDING",
  "AFTER_SALES",
  "LEAD_DECLINED",
  "OTHER",
];

const AddLead = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const storedId = localStorage.getItem("clients_Id");

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "fullName":
        if (!value.trim()) {
          error = "Full name is required.";
        } else if (value.length < 3) {
          error = "Full name must be at least 3 characters.";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required.";
        } else if (!/^\S+@gmail\.com$/.test(value)) {
          error = "Invalid email format.";
        }
        break;

      case "mobileNumber":
        if (!value.trim()) {
          error = "Mobile number is required.";
        } else if (!/^[1-9][0-9]{9}$/.test(value)) {
          error = "Enter valid mobile number.";
        }
        break;

      case "service":
        if (!value.trim()) {
          error = "Service is required.";
        }
        break;

      case "status":
        if (!value.trim()) {
          error = "Status is required.";
        }
        break;

      case "comment":
        if (status === "OTHER" && !value.trim()) {
          error = "Comment is required when status is OTHER.";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));

    return error === "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = [
      validateField("fullName", fullName),
      validateField("email", email),
      validateField("mobileNumber", mobileNumber),
      validateField("service", service),
      validateField("status", status),
      validateField("comment", comment),
    ].every((valid) => valid);

    if (!isValid) {
      Swal.fire({
        title: "Validation Error",
        text: "Please correct the highlighted fields.",
        icon: "error",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    const newLead = { fullName, email, mobileNumber, service, status, comment };

    try {
      await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/leads/sales/${storedId}`, newLead);
      Swal.fire({
        title: "Success!",
        text: "Lead created successfully!",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      })

      // Reset form fields
      setFullName("");
      setEmail("");
      setMobileNumber("");
      setService("");
      setStatus("");
      setComment("");
      setErrors({});
    } catch (error) {
      Swal.fire({
        title: "Something went happened!",
        text: error?.response?.data|| error?.response?.data?.message ||"Please try again.",
        icon: "error",
        confirmButtonText: "OK"
        // showConfirmButton: false,
        // timer: 1000,
      });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-8 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
          <div className="card">
            <div className="card-body" style={{ maxHeight: "500px", overflowY: "auto" }}>
              <h2 className="mb-4 text-center">Create Lead</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      validateField("fullName", e.target.value);
                    }}
                  />
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateField("email", e.target.value);
                    }}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Mobile Number</label>
                  <input
                    id="mobileNumber"
                    type="text"
                    className={`form-control ${errors.mobileNumber ? "is-invalid" : ""}`}
                    placeholder="Enter mobile number"
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                      validateField("mobileNumber", e.target.value);
                    }}
                  />
                  {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Service</label>
                  <input
                    id="service"
                    type="text"
                    className={`form-control ${errors.service ? "is-invalid" : ""}`}
                    placeholder="Enter service"
                    value={service}
                    onChange={(e) => {
                      setService(e.target.value);
                      validateField("service", e.target.value);
                    }}
                  />
                  {errors.service && <div className="invalid-feedback">{errors.service}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    id="status"
                    className={`form-select ${errors.status ? "is-invalid" : ""}`}
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      validateField("status", e.target.value);
                    }}
                  >
                    <option value="">Select Status</option>
                    {salesStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                </div>
                {status === "OTHER" && (
                  <div className="mb-3">
                    <textarea
                      id="comment"
                      className={`form-control ${errors.comment ? "is-invalid" : ""}`}
                      placeholder="Enter comment"
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                        validateField("comment", e.target.value);
                      }}
                    />
                    {errors.comment && <div className="invalid-feedback">{errors.comment}</div>}
                  </div>
                )}
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn submit_button mt-4 w-auto mb-4">
                    <span>Create Lead</span>
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

export default AddLead;
