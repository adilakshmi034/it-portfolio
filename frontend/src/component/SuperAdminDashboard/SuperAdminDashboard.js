import React, { useState } from "react";
import Sidenav from "../../Screens/Sidenav/Sidenav";
import Header from "../../Screens/Header/Header";
import { Outlet } from "react-router-dom";
import "./SuperAdminDashboard.css";

function SuperAdminDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="dashboard-wrapper">
      <Header isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className="content-wrapper">
        <Sidenav isCollapsed={isCollapsed} />
        <div className="main-content">
          <Outlet /> {/* This renders the child routes */}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
