import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import './EditRole.css'; // Assuming you want to reuse the CSS styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from "../../../axiosInstance";

const EditRole = () => {
  const navigate = useNavigate();
  const { roleId } = useParams(); // Assuming roleId is passed as a route parameter

  const [role, setRole] = useState({
    roleName: "",
    username: "",
    password: "",
    roleUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  useEffect(() => {
    const fetchRoleDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/role/get/${roleId}`);
        const roleData = response.data;

        if (roleData) {
          setRole(roleData);
        } else {
          alert("Role not found.");
          navigate("/superadmindashboard");
        }
      } catch (error) {
        setError("Failed to load role details.");
        console.error("Error loading role details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleDetails();
  }, [roleId, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRole((prevRole) => ({ ...prevRole, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.put(`${process.env.REACT_APP_API_URL}/api/role/${roleId}`, role, {
        headers: { "Content-Type": "application/json" },
      });
      Swal.fire({
        title: "Success!",
        text: "Role updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(-1); // Go back to the previous page
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error updating role.";
      console.error("Error updating role:", errorMessage);
      Swal.fire({
        title: "Error!",
        text: `Failed to update role: ${errorMessage}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-12 col-md-10 col-lg-10 col-xl-8 col-xxl-8">
          <div className="card">
            <div className="card-body">
              <h2 className="mb-4 text-center">Edit Role</h2>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {loading && <p>Loading...</p>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="roleName" className="form-label">Role Name</label>
                  <input
                    type="text"
                    id="roleName"
                    name="roleName"
                    className="form-control"
                    value={role.roleName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    value={role.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="form-control"
                    value={role.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute end-0 top-0 me-3"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ textDecoration: "none" }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                <div className="mb-3">
                  <label htmlFor="roleUrl" className="form-label">Role URL</label>
                  <input
                    type="text"
                    id="roleUrl"
                    name="roleUrl"
                    className="form-control"
                    value={role.roleUrl}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn submit_button mt-3 w-auto"
                    disabled={loading}
                  >
                    <span>{loading ? "Updating..." : "Update Role"}</span>
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

export default EditRole;
