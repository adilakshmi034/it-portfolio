import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./AdminSidenav.css";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";

function Sidenav({ isCollapsed }) {
  const navigate = useNavigate();
  const [currentOpenMenu, setCurrentOpenMenu] = useState(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  // Logout handler (for the Logout menu item)
  const handleLogout = (e) => {
    e.preventDefault();
      // Show confirmation if it's the first time logging out
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
          localStorage.clear();
          localStorage.setItem("isLoggedIn", "false");
          setIsLoggedOut(true); // Mark the user as logged out
          Swal.fire({
            title: "Logged Out",
            text: "You have been logged out successfully.",
            icon: "success",
            timer: 2000, // Auto-close after 2 seconds
            showConfirmButton: false, // Hide the "OK" button
          }).then(() => {
            navigate("/login");
          });
        }
      });
    };
  return (
    <div
      className={`nav-menu col-lg-3 col-xl-2 col-xxl-2 col-sm-4 col-md-3 col-12 ${isCollapsed ? "collapsed" : ""}`}
    >
      <ul className="nav-menu-items">
        {SidebarData.map((item, index) => (
          <SubMenu
            key={index}
            item={item}
            isCollapsed={isCollapsed}
            currentOpenMenu={currentOpenMenu}
            setCurrentOpenMenu={setCurrentOpenMenu} // Pass state handler
            onLogout={item.title === "Logout" ? handleLogout : null}
          />
        ))}
      </ul>
    </div>
  );
}

export default Sidenav;
