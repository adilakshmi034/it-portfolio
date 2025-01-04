import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Button, Dropdown } from "react-bootstrap";
import {
  FaEdit,
  FaTrash,
  FaUserShield,
  FaEye,
  FaEllipsisV,
  FaPlus,
  FaInfoCircle,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductList.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../axiosInstance";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/get/all`
        );
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: "Failed to load products.",
          confirmButtonText: "Try Again",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle deletion
  const handleDelete = (id) => {
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
            `${process.env.REACT_APP_API_URL}/api/products/delete/${id}`
          );
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.productId !== id)
          );
          // Success alert
          Swal.fire({
            title: "Deleted!",
            text: "The product details  has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });
        } catch (error) {
          // Error alert
          Swal.fire({
            title: "Something went happened!",
            text: "The product has been deleted.",
            icon: "error",
            showConfirmButton: false, // Disable confirmation button
            timer: 1000, // Auto-close after 1 second
          });
        }
      }
    });
  };

  // Handle navigation actions
  const handleEdit = (id) => navigate(`/SuperAdminDashboard/editproduct/${id}`);
  const handleView = (id, name) => {
    navigate(`/superadmindashboard/product/${id}`, {
      state: { productName: name },
    });
  };

  const handleAssignRole = (id) =>
    navigate(`/superadmindashboard/assignrole/${id}`);

  // New action handlers
  const handleAddProductDetails = (id) =>
    navigate(`/superadmindashboard/AddProductDetails/${id}`);
  const handleViewProductDetails = (id) => {
    navigate(`/superadmindashboard/ViewProductDetails/${id}`);
  };

  // Pagination
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

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
      <div className="search-add-actions mb-3">
        <input
          type="text"
          className="search-bar"
          placeholder="Search products..."
          value={searchQuery}
          // onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="table-horizantal-scrollables">
        <div className="table-scrollables">
          <div className="table-container ">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Discount Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product, index) => (
                    <tr key={product.productId}>
                      <td>{indexOfFirstProduct + index + 1}</td>
                      <td>
                        <img
                          src={
                            product.image
                              ? `data:image/jpeg;base64,${product.image}`
                              : "https://via.placeholder.com/50"
                          }
                          alt={product.productName}
                          className="table-img"
                          style={{ width: "50px", height: "50px" }}
                        />
                      </td>
                      <td>{product.productName}</td>
                      <td className="description-cell">
                        {product.productDescription}
                      </td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>
                        {product.discountPrice ? (
                          <span className="discount-prices">
                            ${product.discountPrice.toFixed(2)}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        <Dropdown className="ellipsis-dropdown">
                          <Dropdown.Toggle
                            variant="link"
                            id={`dropdown-basic-${product.productId}`}
                            className="ellipsis-toggle"
                          >
                            <FaEllipsisV className="ellipsis-icon" />
                          </Dropdown.Toggle>

                          <Dropdown.Menu
                            align="end"
                            popperConfig={{
                              modifiers: [
                                {
                                  name: "preventOverflow",
                                  options: {
                                    boundary: "viewport",
                                  },
                                },
                              ],
                            }}
                          >
                            <Dropdown.Item
                              onClick={() =>
                                handleView(
                                  product.productId,
                                  product.productName
                                )
                              }
                            >
                              <FaEye /> View Roles
                            </Dropdown.Item>

                            <Dropdown.Item
                              onClick={() => handleEdit(product.productId)}
                            >
                              <FaEdit /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleAssignRole(product.productId)
                              }
                            >
                              <FaUserShield /> Assign Role
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleAddProductDetails(product.productId)
                              }
                            >
                              <FaPlus /> Add Product Details
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleViewProductDetails(product.productId)
                              }
                            >
                              <FaEye /> View Product Details
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleDelete(product.productId)}
                            >
                              <FaTrash /> Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No products found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            {/* Previous Button */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link btn-sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                aria-label="Previous"
              >
                <i className="fas fa-angle-double-left"></i>{" "}
                {/* Left double arrow */}
              </button>
            </li>

            {/* Next Button */}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link btn-sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Next"
              >
                <i className="fas fa-angle-double-right"></i>{" "}
                {/* Right double arrow */}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProductList;
