import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import "./ProductsByCategory.css";

const ProductsBySubCategory = ({ closeProductsView }) => {
  const { subCategoryId } = useParams(); // Access the subCategoryId from the route
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/subcategory/${subCategoryId}`
        );
        setProducts(response.data);
      } catch (error) {
        setError("Error fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subCategoryId]);

  const handleEdit = (productId) => {
    navigate(`/SuperAdminDashboard/editproduct/${productId}`);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00d5cd",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${process.env.REACT_APP_API_URL}/api/subcategories/${id}`)
          .then(() => {
            setProducts((prevProducts) =>
              prevProducts.filter((product) => product.productId !== id)
            );
            Swal.fire({
              title: "Deleted!",
              text: "The product has been deleted.",
              icon: "success",
              showConfirmButton: false,
              timer: 1000,
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Something went happened!",
              text: "There was an error deleting the lead.",
              icon: "error",
              showConfirmButton: false, // Disable confirmation button
              timer: 1000, // Auto-close after 1 second
            });
          });
      }
    });
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePreviousPage = () => setCurrentPage(currentPage - 1);
  const handleNextPage = () => setCurrentPage(currentPage + 1);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

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
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Back arrow button */}
        <FaArrowLeft
          size={24}
          className="back-arrow"
          style={{ cursor: "pointer" }}
          onClick={() =>
            closeProductsView ? closeProductsView() : navigate(-1)
          }
        />
        <h2 className="text-center mb-0">
          Products for Subcategory ID: {subCategoryId}
        </h2>
        <div></div> {/* Empty div for alignment purposes */}
      </div>

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
              <tr key={product.id}>
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
                <td>{product.productDescription}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  {product.discountPrice
                    ? `$${product.discountPrice.toFixed(2)}`
                    : "N/A"}
                </td>
                <td>
                  <Button
                    className="action-buttons edit"
                    onClick={() => handleEdit(product.productId)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    className="action-buttons delete"
                    onClick={() => handleDelete(product.productId)}
                  >
                    <FaTrash />
                  </Button>
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
                {/* Left double arrow icon */}
              </button>
            </li>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link btn-sm d-none d-md-inline-block" // Hide page numbers on small screens
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

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
                {/* Right double arrow icon */}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProductsBySubCategory;
