import React, { useState } from 'react'; 
import Header from '../../Screens/Header/Header';
import { Outlet } from 'react-router-dom'; 
// import "../SuperAdminDashboard.css"; 
import SalesSidenav from './SalesSidenav/SalesSidenav'; 


function SalesDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); 
  };

  return (
    <div style={{ width: "100%" }}>
      <Header isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} /> 
      <div className="content-wrapper">
        <SalesSidenav isCollapsed={isCollapsed} />
        <div className="main-content">
          <Outlet /> {/* This renders the child routes */}
        </div>
      </div>
    </div>
  );
}

export default SalesDashboard;
