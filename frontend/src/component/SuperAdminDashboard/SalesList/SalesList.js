import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./SalesList.css";
import { useNavigate } from "react-router-dom";

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewUsersForSale, setViewUsersForSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage, setSalesPerPage] = useState(20);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const storedId = localStorage.getItem("clients_Id");

  const PageLengthDropdown = ({ totalSales, currentPageFirstId }) => {
    const startRange = currentPageFirstId || 1;
    const endRange = Math.min(startRange + salesPerPage - 1, totalSales);

    const handleDropdownToggle = () => {
      setDropdownOpen(!dropdownOpen);
    };

    const handleOptionClick = (option) => {
      setSalesPerPage(option);
      setDropdownOpen(false);
    };

    return (
      <div className="page-length-dropdown">
        <button className="dropdown-toggle" onClick={handleDropdownToggle}>
          {startRange}-{endRange} of {totalSales}
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
    const fetchSales = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/clients/sales/by-client/superadmin/${storedId}`
        );
        setSales(response.data);
      } catch (error) {
        setError("Error fetching sales.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [storedId]);

  // Handle Edit action
  const handleEdit = (saleId) => {
    navigate(`/SuperAdminDashboard/editsale/${saleId}`);
  };

  // Handle Delete action
  const handleDelete = async (saleId) => {
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
          `${process.env.REACT_APP_API_URL}/api/clients/delete/${saleId}`
        );
       // Update the sales state immediately without using the stale sales state
       setSales((prevSales) => prevSales.filter((sale) => sale.id !== saleId));

        Swal.fire({
          title: "Deleted!",
          text: "Sale has been deleted.",
          icon: "success",
          showConfirmButton: false, // Hides the confirm button
          timer: 1000, // Closes the alert after 1500ms (1.5 seconds)
        });
      } catch (error) {
        setError("Error deleting sale.");
      }
    }
  };

  // Handle View Users action
  const handleViewUsers = (saleId) => {
    setViewUsersForSale(saleId);
  };

  const closeUsersView = () => {
    setViewUsersForSale(null);
  };

  // Pagination Logic
  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const totalPages = Math.ceil(sales.length / salesPerPage);
  const currentPageFirstId =
    sales.length > 0 ? sales[indexOfFirstSale]?.sales_Id : 0;

  const changePage = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredSales = Array.isArray(sales)
  ? sales.filter((sale) => {
      const emailMatch = sale.email
        .toLowerCase()
        .includes(emailSearchTerm.toLowerCase());
      const fullNameMatch = sale.fullName
        .toLowerCase()
        .includes(nameSearchTerm.toLowerCase());
      const mobileNumberMatch = sale.mobileNumber
        ? sale.mobileNumber.toString().includes(mobileSearchTerm)
        : false;

      return (
        (!emailSearchTerm || emailMatch) &&
        (!nameSearchTerm || fullNameMatch) &&
        (!mobileSearchTerm || mobileNumberMatch)
      );
    })
  : [];


  const finalFilteredSales = filteredSales.filter((sale) => {
    const queryLower = searchTerm.toLowerCase();
    return (
      sale.email.toLowerCase().includes(queryLower) ||
      sale.fullName.toLowerCase().includes(queryLower) ||
      (sale.mobileNumber && sale.mobileNumber.toString().includes(queryLower))
    );
  });

  const indexOfLastFilteredSale = currentPage * salesPerPage;
  const indexOfFirstFilteredSale = indexOfLastFilteredSale - salesPerPage;
  const paginatedSales = finalFilteredSales.slice(
    indexOfFirstFilteredSale,
    indexOfLastFilteredSale
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
      <div className="filters">
        <div className="filter-card">
          <div className="filter-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Search by email"
              value={emailSearchTerm}
              onChange={(e) => setEmailSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="filter-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Search by full name"
              value={nameSearchTerm}
              onChange={(e) => setNameSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="filter-group">
            <label>Mobile Number</label>
            <input
              type="text"
              placeholder="Search by mobile number"
              value={mobileSearchTerm}
              onChange={(e) => setMobileSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </div>

      <div className="admin-table-container">
        <div className="table-header-actions">
          <PageLengthDropdown
            totalSales={finalFilteredSales.length}
            currentPageFirstId={currentPageFirstId}
          />
          <div className="search-add-actions">
            <input
              type="text"
              className="search-bar"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  <th className="sales_ID">ID</th>
                  <th className="sales_FullName">Full Name</th>
                  <th className="sales_Email">Email</th>
                  <th className="sales_Mobile">Mobile Number</th>
                  <th className="sales_Role">Role</th>
                  <th className="sales_Actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSales.map((sale, index) => (
                  <tr key={sale.sales_Id}>
                    <td className="sales_ID">
                      {index + 1 + (currentPage - 1) * salesPerPage}
                    </td>
                    <td className="sales_FullName">{sale.fullName}</td>
                    <td className="sales_Email">{sale.email}</td>
                    <td className="sales_Mobile">{sale.mobileNumber}</td>
                    <td className="sales_Role">{sale.role}</td>
                    <td className="sales_Actions">
                      <button
                        onClick={() => handleEdit(sale.id)}
                        className="action-buttons edit"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="action-buttons delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
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

export default SalesList;
