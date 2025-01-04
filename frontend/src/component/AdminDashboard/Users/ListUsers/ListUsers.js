import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../axiosInstance";

const salesStatusOptions = [
  "LEAD_GENERATION",
  "CONTRACT_SIGNING",
  "LEAD_QUALIFICATION",
  "LEAD_INITIAL_CONTACT",
  "LEAD_PROPOSAL",
  "NEGOTIATION",
  "LEAD_CLOSING",
  "LEAD_ONBOARDING",
  "AFTER_SALES",
  "LEAD_DECLINED",
  "OTHER",
];

const ListUsers = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage, setSalesPerPage] = useState(20);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const storedId = localStorage.getItem("clients_Id");

  // Function to handle page length change
  const handlePageLengthChange = (length) => {
    setSalesPerPage(length); // Update the number of sales per page
    setCurrentPage(1); // Reset to the first page when changing the page length
    setDropdownOpen(false); // Close the dropdown after selection
  };

  // Fetch sales data from API
  const fetchSales = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/leads/get/all`);
      setSales(response.data); // Update with API response
    } catch (err) {
      setError(
        err.response
          ? `Error fetching sales: ${err.response.status} - ${err.response.statusText}`
          : "Error fetching sales: An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleEditLead = (leadId) => {
    navigate(`/superadmindashboard/EditLeads/${leadId}`);
  };

  const handleDeleteLead = async (leadId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00d5cd",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosInstance.delete(`${process.env.REACT_APP_API_URL}/api/leads/deleteLead/${leadId}`);

        // Update sales state to remove the deleted lead
        setSales(sales.filter((sale) => sale.leadId !== leadId));

        // Success alert
        Swal.fire({
          title: "Deleted!",
          text: "The lead has been deleted.",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (error) {
        // Error alert
        Swal.fire({
          title: "Something went wrong!",
          text: "There was an error deleting the lead.",
          icon: "error",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    }
  };

  const handleStatusChange = async (leadId, status) => {
    try {
      await axiosInstance.put(`${process.env.REACT_APP_API_URL}/api/leads/${leadId}`, {
        status,
      });

      setSales(
        sales.map((lead) =>
          lead.leadId === leadId ? { ...lead, status } : lead
        )
      );

      Swal.fire({
        title: "Success!",
        text: "Status updated successfully.",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Error updating lead status:", error);
      Swal.fire({
        title: "Something went wrong!",
        text: error || "Failed to update status.",
        icon: "error",
        showConfirmButton: true,
      });
    }
  };

  const filteredLeads = sales.filter((lead) => {
    const queryLower = searchQuery.toLowerCase();
    return (
      lead.email.toLowerCase().includes(queryLower) ||
      lead.fullName.toLowerCase().includes(queryLower) ||
      (lead.mobileNumber && lead.mobileNumber.toString().includes(queryLower))
    );
  });

  const indexOfLastLead = currentPage * salesPerPage;
  const indexOfFirstLead = indexOfLastLead - salesPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / salesPerPage);

  const changePage = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (error) {
    return <div className="text-danger">{error}</div>;
  }

  return (
    <div className="container mt-4 leads-list-container">
      <div className="filters">
        <div className="filter-card">
          <div className="filter-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Search by email or fullName or mobileNumber"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </div>
      
      <div className="admin-table-container">
        <div className="table-header-actions">
          <div className="page-length-dropdown">
            <button
              className="dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Select number of leads per page"
            >
          
          <span className="dropdown-icon">▼</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-options">
                {[5, 10, 15].map((option) => (
                  <div
                    key={option}
                    className="dropdown-option"
                    onClick={() => handlePageLengthChange(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="table-scrollable">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>sale Id</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Service</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead, index) => (
                <tr key={lead.leadId}>
                  <td>{index + 1}</td>
                  <td>{storedId}</td>
                  <td>{lead.fullName}</td>
                  <td>{lead.email}</td>
                  <td>{lead.mobileNumber}</td>
                  <td>{lead.service}</td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(lead.leadId, e.target.value)
                      }
                    >
                      {salesStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => handleEditLead(lead.leadId)}
                      className="action-buttons edit"
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => handleDeleteLead(lead.leadId)}
                      className="action-buttons delete"
                    />
                  </td>
                </tr>
              ))}
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
  );
};

export default ListUsers;
