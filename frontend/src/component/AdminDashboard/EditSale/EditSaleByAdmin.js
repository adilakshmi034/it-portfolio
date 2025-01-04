import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";  // Import icons
import './EditSaleByAdmin.css';
import axiosInstance from "../../../axiosInstance";

const EditSaleByAdmin = () => {
  const navigate = useNavigate();
  const { id: salesId } = useParams(); // Use salesId from the URL params

  const [sales, setSales] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Fetch sales details from API
  useEffect(() => {
    if (salesId) {
      axiosInstance
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
  

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSales((prevSales) => ({
      ...prevSales,
      [name]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Handle form submission for updating sales details
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axiosInstance
      .put(`${process.env.REACT_APP_API_URL}/api/clients/update/${salesId}`, sales)
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: "Sales details updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/admindashboard/salesList/:adminId"); // Redirect after update
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: "Failed to update sales details.",
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
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <h2 className="mb-4 mt-3 text-center">Edit Sale</h2>
            <div className="card-body">
              {error && <p style={{ color: "red" }}>{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-control"
                    value={sales.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={sales.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                  <input
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    className="form-control"
                    value={sales.mobileNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}  
                    id="password"
                    name="password"
                    className="form-control"
                    value={sales.password}
                    onChange={handleChange}
                    required
                  />
               
                  <span
                    className="password-toggle-icon"
                    onClick={togglePasswordVisibility}
                    style={{ position: "absolute", right: "10px", top: "55px", cursor: "pointer" }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}  
                  </span>
                </div> */}
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn submit_button mt-4 w-auto mb-4"
                    disabled={loading}
                  >
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

export default EditSaleByAdmin;
