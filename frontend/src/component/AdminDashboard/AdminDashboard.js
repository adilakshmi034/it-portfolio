import React, { useState } from "react"; // Import useState for managing sidebar state
import Header from "../../Screens/Header/Header"; // Import the Header component
import { Outlet } from "react-router-dom"; // Import Outlet for nested routes
import AdminSidenav from "./AdminSidenav/AdminSidenav"; // Import the Admin Sidenav component

function AdminDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); // Toggle the collapsed state
  };

  return (
    <div className="dashboard-wrapper">
      <Header isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className="content-wrapper">
        <AdminSidenav isCollapsed={isCollapsed} />
        <div className="main-content">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
