import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaArrowLeft } from "react-icons/fa";
import {
  faEdit,
  faTrash,
  faEye,
  faArrowLeft,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
// import "./SalesByAdmin.css";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation

const SalesByAdmins = ({ adminId, closeSalesView }) => {
  const [salesList, setSalesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [nameSearchTerm, setNameSearchTerm] = useState("");
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage, setSalesPerPage] = useState(20);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // To detect where the user came from
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
      setLoading(true);
      setError(null);

      try {
        const response1 = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/clients/sales/by-client/admin/${storedId}`
        );
        setSalesList(response1.data);
      } catch (err) {
        console.error(
          "Error fetching admin sales:",
          err.response ? err.response.data : err.message
        );
        // try {
        //   const response2 = await axios.get(
        //     `${process.env.REACT_APP_API_URL}/api/sales/admin/${adminId}`
        //   );
        //   setSalesList(response2.data);
        // } catch (err) {
        //   console.error(
        //     "Error fetching super admin sales:",
        //     err.response ? err.response.data : err.message
        //   );
        //   setError("Failed to fetch sales data from both sources.");
        // }
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [adminId, storedId]);

  const handleEdit = (saleId) => {
    navigate(`/superadmindashboard/editsale/${saleId}`);
  };

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
          `${process.env.REACT_APP_API_URL}/api/sales/${saleId}`
        );
        setSalesList(salesList.filter((sale) => sale.sales_Id !== saleId));
        Swal.fire({
          title: "Deleted!",
          text: "Sale has been deleted.",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (error) {
        setError("Error deleting sale.");
      }
    }
  };

  // Pagination Logic
  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const totalPages = Math.ceil(salesList.length / salesPerPage);
  const currentPageFirstId =
    salesList.length > 0 ? salesList[indexOfFirstSale]?.sales_Id : 0;

  const changePage = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Filter Sales based on search terms
  const filteredSales = salesList.filter((sale) => {
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
  });

  // Further filter based on the general search query
  const finalFilteredSales = filteredSales.filter((sale) => {
    const queryLower = searchTerm.toLowerCase();
    return (
      sale.email.toLowerCase().includes(queryLower) ||
      sale.fullName.toLowerCase().includes(queryLower) ||
      (sale.mobileNumber && sale.mobileNumber.toString().includes(queryLower))
    );
  });

  // Calculate current sales based on pagination
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
    return <div>Error fetching sales data: {error}</div>;
  }

  return (
    <div className="saleslists saleslistes">
      {/* Back Button */}
      <button className="back-button back-arrow" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>
      <div className="filters">
        <div className="filter-card">
          <div className="filter-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Search by email"
              value={emailSearchTerm}
              onChange={(e) => setEmailSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Search by full name"
              value={nameSearchTerm}
              onChange={(e) => setNameSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Mobile Number</label>
            <input
              type="text"
              placeholder="Search by mobile number"
              value={mobileSearchTerm}
              onChange={(e) => setMobileSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="saleslist">
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
          <table className="sales-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSales.map((sale, index) => (
                <tr key={sale.sales_Id}>
                  <td>{index + 1 + (currentPage - 1) * salesPerPage}</td>
                  <td>{sale.fullName}</td>
                  <td>{sale.email}</td>
                  <td>{sale.mobileNumber}</td>
                  <td>{sale.role}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => handleEdit(sale.sales_Id)}
                      className="action-buttons edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(sale.sales_Id)}
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

        <div className="pagination">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              {/* Previous Button */}
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => changePage("prev")}
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
                    className="page-link"
                    onClick={() => setCurrentPage(index + 1)}
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
                  className="page-link"
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

export default SalesByAdmins;
