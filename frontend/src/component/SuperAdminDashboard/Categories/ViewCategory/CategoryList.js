import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faEye,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./CategoryList.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../axiosInstance";
import axios from "axios";

const CategoryList = ({ superAdminId }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const [viewSubcategoriesForCategory, setViewSubcategoriesForCategory] =
    useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage, setCategoriesPerPage] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const storedId = localStorage.getItem("clients_Id");

  // Page length dropdown component
  const PageLengthDropdown = ({ totalCategories, currentPageFirstId }) => {
    const startRange = currentPageFirstId || 1;
    const endRange = Math.min(
      startRange + categoriesPerPage - 1,
      totalCategories
    );

    const handleDropdownToggle = () => {
      setDropdownOpen(!dropdownOpen);
    };

    const handleOptionClick = (option) => {
      setCategoriesPerPage(option);
      setDropdownOpen(false);
      setCurrentPage(1);
    };

    return (
      <div className="page-length-dropdown">
        <button className="dropdown-toggle" onClick={handleDropdownToggle}>
          {startRange}-{endRange} of {totalCategories}
        </button>
        {dropdownOpen && (
          <div className="dropdown-options">
            {[20, 50].map((option) => (
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

  // Fetch categories function
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/category/getbycategory/${storedId}`
      );
      console.log("API Response:", response.data);
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Error fetching categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [storedId]);

  const handleEdit = (categoryId) => {
    navigate(`/SuperAdminDashboard/editcategory/${categoryId}`);
  };

  const handleDelete = async (categoryId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00d5cd",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(
          `${process.env.REACT_APP_API_URL}/api/category/deletecategory/${categoryId}`
        );
        fetchCategories();
        // Success alert
        Swal.fire({
          title: "Deleted!",
          text: "Deleted category successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (error) {
        // Error alert
        Swal.fire({
          title: "Something went happened!",
          text: "Category has been deleted.",
          icon: "error",
          showConfirmButton: false, // Disable confirmation button
          timer: 1000, // Auto-close after 1 second
        });
      }
    }
  };

  const handleViewSubcategories = (categoryId) => {
    navigate(`/superadmindashboard/subcategorylist/${categoryId}`);
    setViewSubcategoriesForCategory(categoryId);
  };

  // Pagination Logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(categories.length / categoriesPerPage);
  const currentPageFirstId =
    currentCategories.length > 0 ? currentCategories[0].categoryId : 0;

  const changePage = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate current categories based on the filtered results and pagination
  const indexOfLastFilteredCategory = currentPage * categoriesPerPage;
  const indexOfFirstFilteredCategory =
    indexOfLastFilteredCategory - categoriesPerPage;
  const paginatedCategories = filteredCategories.slice(
    indexOfFirstFilteredCategory,
    indexOfLastFilteredCategory
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
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-4 categorylist">
      {/* <div className="card">
        <div className="card-body"> */}
      <div className="admin-table-container">
        <div className="table-header-actions">
          <PageLengthDropdown
            totalCategories={categories.length}
            currentPageFirstId={currentPageFirstId}
          />
          <div className="search-add-actions">
            <input
              type="text"
              placeholder="Search category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
            <button className="search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        <div className="table-horizantal-scrollable">
          <div className="table-scrollable">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((category, index) => (
                  <tr key={category.categoryId}>
                    <td>{index + 1 + (currentPage - 1) * categoriesPerPage}</td>
                    <td>{category.name}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(category.categoryId)}
                        className="action-buttons edit"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.categoryId)}
                        className="action-buttons delete"
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        onClick={() =>
                          handleViewSubcategories(category.categoryId)
                        }
                        className="action-buttons view"
                        title="View Subcategories"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
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
                  onClick={() => changePage("next")}
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
        {/* </div>
      </div> */}
      </div>
    </div>
  );
};

export default CategoryList;
