import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidenav.css";
import { SidebarData } from "./SidebarData";
import SubMenu from "./SubMenu";
import Swal from "sweetalert2";

function Sidenav({ isCollapsed }) {
  const [openMenu, setOpenMenu] = useState(null); // Track which top-level menu is open
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
 

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
          localStorage.setItem("isLoggedIn", "false");
          localStorage.clear();
          setIsLoggedOut(true); // Mark the user as logged out
          Swal.fire({
            title: "Logged Out",
            text: "You have been logged out successfully.",
            icon: "success",
            timer: 1000,
            showConfirmButton: false, // Hide the "OK" button
          }).then(() => {
            navigate("/login");
          });
        }
      });
    };

  return (
    <div className={`nav-menu col-lg-3 col-xl-2 col-xxl-2 col-sm-4 col-md-3 col-12 ${isCollapsed ? "collapsed" : ""}`}>
      <ul className="nav-menu-items">
        {SidebarData.map((item, index) => (
          <SubMenu
            key={index}
            item={item}
            isCollapsed={isCollapsed}
            isOpen={openMenu === item.title} // Check if this menu is active
            setOpenMenu={setOpenMenu} // Update the open menu
            onLogout={item.title === "Logout" ? handleLogout : null}
          />
        ))}
      </ul>
    </div>
  );
}

export default Sidenav;
