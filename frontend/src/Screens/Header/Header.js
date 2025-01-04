import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import LOGOFULL from "../../assets/IT Portfolio copy (1).jpg";
import FAVICON from "../../assets/Fav it copy.png"; // Path for favicon
import Swal from "sweetalert2";
import * as IoIcons from "react-icons/io"; // Ionicons
import { Container, Row, Col, Button } from "react-bootstrap"; // Importing Bootstrap components

function Header({ isCollapsed, toggleSidebar }) {
  const navigate = useNavigate(); // Use the navigate hook for navigation
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const role = localStorage.getItem("role");
  const fullName = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");
  const profileImage = localStorage.getItem("profileImage"); // Get the profile image from local storage

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState); // Toggle dropdown visibility
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00d5cd",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove all user-related data from localStorage
        localStorage.clear();

        // Set isLoggedIn to false
        localStorage.setItem("isLoggedIn", "false");
        // Navigate to login page
        navigate("/Login");
      }
    });
  };

  // Navigate to the home page
  const handleGoToHome = () => {
    navigate("/"); // This will navigate to the home page
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the dropdown if the click is outside the dropdown menu
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigateToProfile = () => {
    if (role === "ROLE_SUPERADMIN") {
      navigate("/superadmindashboard/Profiles");
    } else if (role === "ROLE_ADMIN") {
      navigate("/admindashboard/Profiles");
    } else if (role === "ROLE_SALES") {
      navigate("/salesdashboard/Profiles");
    } else {
      navigate("/Profiles"); // Fallback if role is undefined
    }
  };

  return (
    <header
      className="header px-0 py-0 m-0"
      style={{ position: "fixed", top: "0px", zIndex: "9999" }}
    >
      <div className="header-content">
        <Container fluid>
          <Row className="align-items-center">
            <Col xs={10} sm={6} md={4}>
              <div className="full-logo px-0 py-0 m-0">
                <img
                  src={isCollapsed ? FAVICON : LOGOFULL}
                  alt="Logo"
                  className="logo-image"
                />
                {/* Toggle Button Positioned Next to Logo */}
                <button className="toggle-button" onClick={toggleSidebar}>
                  {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
                </button>
              </div>
            </Col>

            <Col xs={2} sm={6} md={8} className="d-flex justify-content-end">
              {fullName ? (
                <div className="user-profile" ref={dropdownRef}>
                  <Button
                    className="website-Button mr-sm-5"
                    onClick={handleGoToHome} // Trigger navigation to the home page
                    style={{
                      marginRight: "5px",
                      padding: "5px 10px",
                      border: "1px solid #00d5cd",
                      backgroundColor: "#00d5cd",
                      color: "white",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    Website
                  </Button>
                  <div className="user-info">
                    <span className="user-name d-none d-sm-block">
                      {fullName}
                    </span>
                  </div>
                  {/* Profile Image or Icon */}
                  {profileImage ? (
                    <img
                      src={`data:image/jpeg;base64,${profileImage}`}
                      alt="User Profile"
                      className="admin-icon"
                      onClick={toggleDropdown}
                      style={{
                        cursor: "pointer",
                        width: "40px", // You can adjust the size as needed
                        height: "40px",
                        borderRadius: "50%", // To make it circular
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <AiOutlineUser
                      className="admin-icon"
                      onClick={toggleDropdown}
                      style={{ cursor: "pointer", color: "black" }}
                    />
                  )}
                  {dropdownVisible && (
                    <div
                      className="rounded-1 align-items-center"
                      style={{
                        position: "absolute",
                        top: "70px",
                        right: "5px",
                        backgroundColor: "white",
                        border: "1px solid #00d5cd",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        padding: "8px",
                        zIndex: 1000,
                      }}
                    >
                      <div
                        className="DropdownHeader d-flex flex-column justify-content-center align-items-start"
                        style={{ height: "100%" }}
                      >
                        <span className="user-name d-sm-none">{fullName}</span>
                        {/* Profile option */}
                        <button
                          className="profile-button"
                          style={{
                            padding: "8px 12px",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            width: "100%",
                            textAlign: "left",
                          }}
                          onClick={navigateToProfile}
                        >
                          <AiOutlineUser
                            style={{ marginRight: "8px", color: "black" }}
                          />
                          Profile
                        </button>

                        {/* Logout option */}
                        <button
                          className="bg-transparent border-0 LogoutBtn"
                          onClick={handleLogout}
                          style={{
                            padding: "8px 12px",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            width: "100%",
                            textAlign: "left",
                          }}
                        >
                          <IoIcons.IoMdLogOut
                            style={{ marginRight: "8px", color: "black" }}
                          />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="nav-links text-black fw-bold text-decoration-none"
                  style={{marginRight: "10px",}}
                >
                  Login
                </Link>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </header>
  );
}

export default Header;
