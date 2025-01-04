import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faEye,
  faSearch,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./SubCategoryList.css";
import axiosInstance from "../../../../../axiosInstance";
import axios from "axios";

const SubCategoryList = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [subCategoriesPerPage, setSubCategoriesPerPage] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (categoryId) {
      fetchSubCategories();
    }
  }, [categoryId]);

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/subcategories/${categoryId}`
      );
      setSubCategories(response.data);
    } catch (err) {
      setError("Error fetching subcategories");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (subCategoryId) => {
    navigate(`/superadmindashboard/editsubcategory/${subCategoryId}`);
  };

  const handleView = (subCategoryId) => {
    navigate(`/superadmindashboard/productsbysubcategory/${subCategoryId}`);
  };

  const handleDelete = (subCategoryId) => {
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
            `${process.env.REACT_APP_API_URL}/api/subcategories/delete/${subCategoryId}`
          );
          fetchSubCategories();
          // Success alert
          Swal.fire({
            title: "Deleted!",
            text: "Your subcategory has been deleted.",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          });
        } catch (error) {
          // Error alert
          Swal.fire({
            title: "Something went happened!",
            text: "There was an error deleting the lead.",
            icon: "error",
            showConfirmButton: false, // Disable confirmation button
            timer: 1000, // Auto-close after 1 second
          });
        }
      }
    });
  };

  const filteredSubCategories = subCategories.filter((subCategory) =>
    subCategory.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredSubCategories.length / subCategoriesPerPage
  );
  const indexOfLastSubCategory = currentPage * subCategoriesPerPage;
  const indexOfFirstSubCategory = indexOfLastSubCategory - subCategoriesPerPage;
  const paginatedSubCategories = filteredSubCategories.slice(
    indexOfFirstSubCategory,
    indexOfLastSubCategory
  );

  const changePage = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const PageLengthDropdown = () => {
    const handleDropdownToggle = () => setDropdownOpen(!dropdownOpen);
    const handleOptionClick = (option) => {
      setSubCategoriesPerPage(option);
      setDropdownOpen(false);
      setCurrentPage(1); // Reset to first page
    };

    return (
      <div className="page-length-dropdown">
        <button className="dropdown-toggle" onClick={handleDropdownToggle}>
          {subCategoriesPerPage} per Page
        </button>
        {dropdownOpen && (
          <div className="dropdown-options">
            {[10, 20, 50].map((option) => (
              <div
                key={option}
                className="dropdown-option"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const rowStart = indexOfFirstSubCategory + 1;
  const rowEnd =
    indexOfLastSubCategory > filteredSubCategories.length
      ? filteredSubCategories.length
      : indexOfLastSubCategory;
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

  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4 subcategorylist">
      <div
        className="back-arrow-container back-arrow mb-3"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span className="back-word">Back</span>
      </div>

      <div className="admin-table-container">
        <div className="table-header-actions">
          <PageLengthDropdown />
          <div className="search-add-actions">
            <input
              type="text"
              placeholder="Search subcategory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar form-control"
            />
            <button className="search-button">
              {/* <FontAwesomeIcon icon={faSearch} /> */}
            </button>
          </div>
        </div>

        {/* Page length display */}
        <div className="data-range">
          Showing {rowStart}-{rowEnd} of {filteredSubCategories.length}
        </div>

        <div className="table-horizantal-scrollable">
          <div className="table-scrollable">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Subcategory Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubCategories.length > 0 ? (
                  paginatedSubCategories.map((subCategory, index) => (
                    <tr key={subCategory.id}>
                      <td>
                        {index + 1 + (currentPage - 1) * subCategoriesPerPage}
                      </td>
                      <td>{subCategory.name}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(subCategory.subCategoryId)}
                          className="action-buttons edit"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(subCategory.subCategoryId)
                          }
                          className="action-buttons delete"
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button
                          onClick={() => handleView(subCategory.subCategoryId)}
                          className="action-buttons view"
                          title="View Products"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No subcategories available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pagination">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              {/* Previous Button */}
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link btn-sm"
                  onClick={() => changePage("prev")}
                  disabled={currentPage === 1}
                  aria-label="Previous"
                >
                  <i className="fas fa-angle-double-left"></i>{" "}
                  {/* Left double arrow icon */}
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
                  onClick={() => changePage("next")}
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
    </div>
  );
};

export default SubCategoryList;
