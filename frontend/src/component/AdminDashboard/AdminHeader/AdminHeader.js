import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminHeader.css"; 
import LOGOFULL from "../../assets/IT Portfolio copy (1).jpg";
import FAVICON from "../../assets/Fav it copy.png"; // Path for favicon
import { FaUserCircle, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

function Header({ isCollapsed, toggleSidebar }) {
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const fullName = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");

  const toggleDropdown = () => setDropdownVisible((prevState) => !prevState);
  
  const handleLogout = () => {
    const confirmation = window.confirm("Do you want to logout?");
    if (confirmation) {
      localStorage.removeItem("fullName");
      localStorage.removeItem("email");
      localStorage.removeItem("user_id");
      localStorage.removeItem("admin_Id");
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <div className="full-logo">
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
        <nav className="nav">
          {fullName ? (
            <div className="user-profile" ref={dropdownRef}>
              <div className="user-info">
                <span className="user-name">{fullName}</span>
                <span className="user-email">{email}</span>
              </div>
              <FaUserCircle className="admin-icon" onClick={toggleDropdown} />
              {dropdownVisible && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-links">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
