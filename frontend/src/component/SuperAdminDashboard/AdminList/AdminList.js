import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axiosInstance from "../../../axiosInstance";
import {
  faEdit,
  faTrash,
  faEye,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import SalesByAdmin from "../SalesByAdmins";
import "./AdminList.css";
import { useNavigate } from "react-router-dom";

const AdminList = ({ superAdminId }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewSalesForAdmin, setViewSalesForAdmin] = useState(null);
  const [emailQuery, setEmailQuery] = useState("");
  const [fullNameQuery, setFullNameQuery] = useState("");
  const [mobileNumberQuery, setMobileNumberQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [adminsPerPage, setAdminsPerPage] = useState(20);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const storedId = localStorage.getItem("clients_Id");

  const PageLengthDropdown = ({ totalAdmins, currentPageFirstId }) => {
    const startRange = currentPageFirstId || 1;
    const endRange = Math.min(startRange + adminsPerPage - 1, totalAdmins);

    const handleDropdownToggle = () => {
      setDropdownOpen(!dropdownOpen);
    };

    const handleOptionClick = (option) => {
      setAdminsPerPage(option);
      setDropdownOpen(false);
    };

    return (
      <div className="page-length-dropdown">
        <button className="dropdown-toggle" onClick={handleDropdownToggle}>
          {startRange}-{endRange} of {totalAdmins}
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

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/clients/admins/by-client/${storedId}`
        );
        console.log(response.data);
        setAdmins(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setError("Error fetching admins.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, [superAdminId]);
  

  const handleEdit = (adminId) => {
    navigate(`/SuperAdminDashboard/editadmin/${adminId}`);
  };

  const handleDelete = async (adminId) => {
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
        // Call the delete API
        await axiosInstance.delete(`${process.env.REACT_APP_API_URL}/api/clients/delete/${adminId}`);
        
        setAdmins((prevAdmins) => {
          const updatedAdmins = prevAdmins.filter((admin) => admin.id !== adminId);
          return updatedAdmins;
        });
        
        
        Swal.fire({
          title: "Deleted!",
          text: "Admin has been deleted.",
          icon: "success",
          timer: 1000, // Optional: Auto-close after 1 second
          showConfirmButton: false,
        });
      } catch (error) {
        setError("Error deleting admin.");
        Swal.fire({
          title: "Error!",
          text: "Failed to delete admin. Please try again.",
          icon: "error",
        });
      }
    }
  };
  
  const handleViewSales = (adminId) => {
    setViewSalesForAdmin(adminId);
  };

  const closeSalesView = () => {
    setViewSalesForAdmin(null);
  };

  // Pagination Logic
  const indexOfLastAdmin = currentPage * adminsPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
  const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalPages = Math.ceil(admins.length / adminsPerPage);
  const currentPageFirstId =
    currentAdmins.length > 0 ? currentAdmins[0].admin_Id : 0;

  const changePage = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filter Admins based on Search Queries
  const filteredAdmins = admins.filter((admin) => {
    const emailMatch = admin.email
      .toLowerCase()
      .includes(emailQuery.toLowerCase());
    const fullNameMatch = admin.fullName
      .toLowerCase()
      .includes(fullNameQuery.toLowerCase());
    const mobileNumberMatch = admin.mobileNumber
      ? admin.mobileNumber.toString().includes(mobileNumberQuery)
      : false;

    return (
      (!emailQuery || emailMatch) &&
      (!fullNameQuery || fullNameMatch) &&
      (!mobileNumberQuery || mobileNumberMatch)
    );
  });

  // Further filter based on the general search query from admin-table-container
  const finalFilteredAdmins = filteredAdmins.filter((admin) => {
    const queryLower = searchQuery.toLowerCase();
    return (
      admin.email.toLowerCase().includes(queryLower) ||
      admin.fullName.toLowerCase().includes(queryLower) ||
      (admin.mobileNumber && admin.mobileNumber.toString().includes(queryLower))
    );
  });

  // Calculate current admins based on the filtered results and pagination
  const indexOfLastFilteredAdmin = currentPage * adminsPerPage;
  const indexOfFirstFilteredAdmin = indexOfLastFilteredAdmin - adminsPerPage;
  const paginatedAdmins = finalFilteredAdmins.slice(
    indexOfFirstFilteredAdmin,
    indexOfLastFilteredAdmin
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
    <div className="container mt-4 adminlist">
      {/* Render filters only if we are not viewing sales for an admin */}
      {!viewSalesForAdmin ? (
        <>
          <div className="filters">
            <div className="filter-card">
              <div className="filter-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Search by email"
                  value={emailQuery}
                  onChange={(e) => setEmailQuery(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="filter-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Search by full name"
                  value={fullNameQuery}
                  onChange={(e) => setFullNameQuery(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="filter-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  placeholder="Search by mobile number"
                  value={mobileNumberQuery}
                  onChange={(e) => setMobileNumberQuery(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="admin-table-container">
            <div className="table-header-actions">
              <PageLengthDropdown
                totalAdmins={admins.length}
                currentPageFirstId={currentPageFirstId}
              />
              <div className="search-add-actions">
                <div className="search-container">
                  <input
                    type="text"
                    className="search-bar"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="search-button">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                  </button>
                </div>
              </div>
            </div>
            <div className="table-horizantal-scrollable">
              <div className="table-scrollable">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="Admin_ID">ID</th>
                      <th className="Admin_FullName">Full Name</th>
                      <th className="Admin_Email">Email</th>
                      <th className="Admin_Mobile">Mobile Number</th>
                      <th className="Admin_Role">Role</th>
                      <th className="Admin_Actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAdmins.map((admin, index) => (
                      <tr key={admin.admin_Id}>
                        <td className="Admin_ID">
                          {index + 1 + (currentPage - 1) * adminsPerPage}
                        </td>
                        <td className="Admin_FullName">{admin.fullName}</td>
                        <td className="Admin_Email">{admin.email}</td>
                        <td className="Admin_Mobile">{admin.mobileNumber}</td>
                        <td className="Admin_Role">{admin.role}</td>
                        <td className="Admin_Actions">
                          <button
                            onClick={() => handleEdit(admin.id)}
                            className="action-buttons edit"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => handleDelete(admin.id)}
                            className="action-buttons delete"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                          <button
                            onClick={() => handleViewSales(admin.id)}
                            className="action-buttons view"
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
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link btn-sm"
                      onClick={() => changePage("prev")}
                      disabled={currentPage === 1}
                      aria-label="Previous"
                    >
                      <i className="fas fa-angle-double-left"></i>{" "}
                      {/* Left arrow icon */}
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
                      {/* Right arrow icon */}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </>
      ) : (
        <SalesByAdmin adminId={viewSalesForAdmin} onClose={closeSalesView} />
      )}
    </div>
  );
};

export default AdminList;
