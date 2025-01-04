// RoleAddSuccess.js

import React from "react";
import { useNavigate } from "react-router-dom";

const RoleAddSuccess = () => {
  const navigate = useNavigate();

  const handleAddAnotherRole = () => {
    navigate("/superadmindashboard/assignrole/${id}"); 
  };

  return (
    <div className="container text-center">
      <p>Your role has been added. You can now add another role.</p>
      <button onClick={handleAddAnotherRole} className="btn submit_button">
        Add Another Role
      </button>
    </div>
  );
};

export default RoleAddSuccess;
