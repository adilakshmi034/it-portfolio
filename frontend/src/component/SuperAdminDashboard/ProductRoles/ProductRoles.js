import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";

const ProductRoles = () => {
  const { productId } = useParams();
  const location = useLocation();
  const productName = location.state?.productName || "Default Product Name";
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(20);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/role/byproduct/${productId}`
        );
        // console.log("API Response:", response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          setRoles(response.data);
          setProduct({ productName: `Product ${productId}` });
        } else {
          throw new Error("No roles found for the given product.");
        }
      } catch (err) {
        console.error("Error fetching product details:", err.message);
        setError(err.message);
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: "Failed to load product role details.",
          confirmButtonText: "Try Again",
          timer: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleDeleteRole = (roleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00d5cd",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(
            `${process.env.REACT_APP_API_URL}/api/role/delete/${roleId}`
          );
          setRoles((prevRoles) =>
            prevRoles.filter((role) => role.roleId !== roleId)
          );
          Swal.fire("Deleted!", "The role has been deleted.", "success");
        } catch (error) {
          console.error("There was an error deleting the role:", error);
          Swal.fire(
            "Something went wrong!",
            "There was a problem deleting the role.",
            "error"
          );
        }
      }
    });
  };

  const handleEditRole = (roleId) => {
    navigate(`/superadmindashboard/EditRole/${roleId}`);
  };

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

  return (
    <div className="container mt-5">
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
              <th>Actions</th>
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
                    <a
                      href={role.roleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {role.roleUrl}
                    </a>
                  </td>
                  <td>
                    <Button
                      className="action-buttons edit me-2"
                      onClick={() => handleEditRole(role.roleId)}
                      title="Edit Role"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      className="action-buttons delete"
                      onClick={() => handleDeleteRole(role.roleId)}
                      title="Delete Role"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No roles found</td>
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
                <i className="fas fa-angle-double-left"></i>
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
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
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => changePage("next")}
                disabled={currentPage === totalPages}
              >
                <i className="fas fa-angle-double-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProductRoles;
