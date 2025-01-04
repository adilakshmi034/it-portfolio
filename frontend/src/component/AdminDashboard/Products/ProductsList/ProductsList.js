import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Products per page
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/get/all`
        );
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load products.",
          confirmButtonText: "Try Again",
        });
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the search query
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic applied to filtered products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle page change and reset to the first page when the search query changes
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1); // Reset to first page on new search
  }, [searchQuery]);

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
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="table-horizantal-scrollables">
        <div className="table-scrollables">
          <div className="table-container">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Discount Price</th>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No products found</td>
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

export default ProductsList;
