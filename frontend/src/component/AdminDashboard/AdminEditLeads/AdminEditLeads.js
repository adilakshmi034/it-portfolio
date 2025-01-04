import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

const EditLeads = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { id: leadId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    service: "",
    status: "",
    comment: "",
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/leads/leads/${leadId}`)
      .then((response) => {
        if (response.data) {
          const lead = response.data;
          if (lead) {
            setFullName(lead.fullName || "");
            setEmail(lead.email || "");
            setMobileNumber(lead.mobileNumber || "");
            setService(lead.service || "");
            setStatus(lead.status || "");
            setComment(lead.comment || "");
          } else {
            console.error("Lead data is empty.");
          }
        } else {
          console.error("API returned no data.");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching lead details:", error);
        setIsLoading(false);
      });
  }, [leadId]);

  const validate = (field, value) => {
    let formErrors = { ...errors };

    // Full name validation
    if (field === "fullName") {
      if (!value.trim()) {
        formErrors.fullName = "Full name is required.";
      } else if (value.length < 3) {
        formErrors.fullName = "Full name must be at least 3 characters.";
      } else {
        formErrors.fullName = "";
      }
    }

    // Email validation
    if (field === "email") {
      if (!value.trim()) {
        formErrors.email = "Email is required.";
      } else if (!/^\S+@gmail\.com$/.test(value)) {
        formErrors.email = "Invalid email format.";
      } else {
        formErrors.email = "";
      }
    }

    // Mobile number validation
    if (field === "mobileNumber") {
      const mobileNumberStr = String(value).trim();
      if (!mobileNumberStr) {
        formErrors.mobileNumber = "Mobile number is required.";
      } else if (!/^[1-9][0-9]{9}$/.test(mobileNumberStr)) {
        formErrors.mobileNumber = "Enter Valid mobile number.";
      } else {
        formErrors.mobileNumber = "";
      }
    }

    // Service validation
    if (field === "service") {
      if (!value.trim()) {
        formErrors.service = "Service is required.";
      } else {
        formErrors.service = "";
      }
    }

    // Status validation
    if (field === "status") {
      if (!value.trim()) {
        formErrors.status = "Status is required.";
      } else {
        formErrors.status = "";
      }
    }

    // Comment validation (only required if status is "OTHER")
    if (field === "comment" && status === "OTHER") {
      if (!value.trim()) {
        formErrors.comment = "Comment is required when 'Other' status is selected.";
      } else {
        formErrors.comment = "";
      }
    }

    setErrors(formErrors); // Update errors state
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Update corresponding state
    if (name === "fullName") setFullName(value);
    else if (name === "email") setEmail(value);
    else if (name === "mobileNumber") setMobileNumber(value);
    else if (name === "service") setService(value);
    else if (name === "status") {
      setStatus(value);
      // Clear comment if status is not 'OTHER'
      if (value !== "OTHER") {
        setComment(""); // Clear comment if it's not "OTHER"
        setErrors((prevErrors) => ({ ...prevErrors, comment: "" })); // Reset comment error
      }
    } else if (name === "comment") setComment(value);
  
    // Validate field
    validate(name, value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Ensure comment is required only if status is "OTHER"
     // Ensure comment is required only if status is "OTHER"
  if (status === "OTHER" && !comment.trim()) {
    setErrors((prevErrors) => ({
      ...prevErrors,
      comment: "Comment is required when 'Other' status is selected.",
    }));
    return;
  }
  
    // Ensure there are no validation errors before submitting
    if (Object.values(errors).some((error) => error !== "")) {
      Swal.fire({
        title: "Error!",
        text: "Please fix the errors in the form.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
  
    const updatedLead = {
      fullName,
      email,
      mobileNumber,
      service,
      status,
      comment: status === "OTHER" ? comment : "", // Only send comment if status is "OTHER"
    };
  
    setLoading(true);
  
    axios
      .put(`${process.env.REACT_APP_API_URL}/api/leads/${leadId}`, updatedLead)
      .then((response) => {
        console.log("Lead updated successfully:", response.data);
        Swal.fire({
          title: "Success!",
          text: "Lead updated successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          navigate("/admindashboard/Users/ListUsers"); // Navigate to leads list
        });
      })
      .catch((error) => {
        console.error("Error updating lead:", error);
        Swal.fire({
          title: "Something went happend!",
          text: "There was an error updating the lead.",
          icon: "error",
          confirmButtonText: "OK"
          // showConfirmButton: false,
          // timer: 1000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

  if (isLoading) {
    return (
      <div className="loader">
        <div className="cell d-0"></div>
        <div className="cell d-1"></div>
        <div className="cell d-2"></div>
        <div className="cell d-1"></div>
        <div className="cell d-2"></div>
        <div className="cell d-2"></div>
        <div className="cell d-3"></div>
        <div className="cell d-3"></div>
        <div className="cell d-4"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-12 col-md-10 col-lg-10 col-xl-8 col-xxl-8">
          <div className="card">
            <div
              className="card-body"
              style={{ maxHeight: "500px", overflowY: "auto" }} // Add vertical scrollbar
            >
              <h2 className="mb-4 text-center">Edit Lead</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-control"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={handleChange}
                    required
                  />
                  {errors.fullName && <p className="text-danger">{errors.fullName}</p>}
                </div>
                <div className="mb-3">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <p className="text-danger">{errors.email}</p>}
                </div>
                <div className="mb-3">
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="text"
                    className="form-control"
                    placeholder="Enter mobile number"
                    value={mobileNumber}
                    onChange={handleChange}
                    required
                  />
                  {errors.mobileNumber && <p className="text-danger">{errors.mobileNumber}</p>}
                </div>
                <div className="mb-3">
                  <input
                    id="service"
                    name="service"
                    type="text"
                    className="form-control"
                    placeholder="Enter service"
                    value={service}
                    onChange={handleChange}
                    required
                  />
                  {errors.service && <p className="text-danger">{errors.service}</p>}
                </div>
                <div className="mb-3">
                  <select
                    id="status"
                    name="status"
                    className="form-select"
                    value={status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    {salesStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  {errors.status && <p className="text-danger">{errors.status}</p>}
                </div>
                
                {/* Conditionally show the comment field only if "Other" is selected */}
                {status === "OTHER" && (
                  <div className="mb-3">
                    <textarea
                      id="comment"
                      name="comment"
                      className="form-control"
                      placeholder="Enter comment"
                      value={comment}
                      onChange={handleChange}
                      required
                    />
                    {errors.comment && <p className="text-danger">{errors.comment}</p>}
                  </div>
                )}

                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn submit_button mt-4 w-auto mb-4"
                    disabled={loading}
                  >
                    <span>{loading ? "Updating..." : "Update Lead"}</span>
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

export default EditLeads;
