import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import axiosInstance from '../../../axiosInstance';

const ProductRole = () => {
  const { productId } = useParams();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(20);
  const location = useLocation();
  const { productName } = location.state || {};
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/role/byproduct/${productId}`
        );
        setRoles(response.data || []);
      } catch (err) {
        setError(err.message);
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: "Failed to load roles.",
          confirmButtonText: "Try Again",
          showConfirmButton: false,
          timer: 1000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [productId]);

  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);
  const totalPages = Math.ceil(roles.length / rolesPerPage);

  const changePage = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredRoles = currentRoles.filter(
    (role) =>
      role.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleRoleUrlClick = (roleUrl, username, password) => {
    // Construct URL with credentials as query parameters
    const urlWithParams = `${roleUrl}?username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`;

    // Redirect to the role URL with credentials
    window.location.href = urlWithParams;
  };

  return (
    <div className="container Role-container mt-5 mb-0">
      {/* Back Button */}
      <button className="back-button back-arrow" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <h2 className="text-center mb-4">{productName} Details</h2>

      <div className="d-flex justify-content-end mb-3">
        <input
          type="text"
          placeholder="Search roles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control"
          style={{ width: "300px" }}
        />
      </div>

      <div style={{ height: "400px", overflowY: "auto" }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Role ID</th>
              <th>Role Name</th>
              <th>Username</th>
              <th>Password</th>
              <th>Role URL</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <tr key={role.roleId}>
                  <td>{role.roleId}</td>
                  <td>{role.roleName}</td>
                  <td>{role.username}</td>
                  <td>{role.password}</td>
                  <td>
                    <Button
                      variant="link"
                      onClick={() =>
                        handleRoleUrlClick(role.roleUrl, role.username, role.password)
                      }
                    >
                      Visit Role URL
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No roles found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <div className="pagination">
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => changePage("prev")}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => changePage("next")}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProductRole;
