import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../../SuperAdminDashboard/AddAdmin/AddAdmin.css' 


const AddUsers = ({ AdminId }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const storedId = localStorage.getItem("admin_Id");
  console.log(storedId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make the POST request to the backend
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/${storedId}`, {
        fullName,
        email,
        mobileNumber
      });

      // Handle successful response
      Swal.fire({
        title: 'Success!',
        text: 'Admin created successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      setFullName('');
      setEmail('');
      setMobileNumber('');
    } catch (error) {
      // Handle error response
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create admin. ' + (error.response ? error.response.data.message : 'Please try again.'),
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-8 col-md-8 col-lg-6 col-xl-6 col-xxl-6">
          <div className="card">
            <div className="card-body mt-3">
              <h2 className="mb-4 text-center">Create Lead</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label"></label>
                  <input
                    id="fullName"
                    type="text"
                    className="form-control mt-5 mb-4"
                    placeholder="Enter Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label"></label>
                  <input
                    id="email"
                    type="email"
                    className="form-control mb-4"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="mobileNumber" className="form-label"></label>
                  <input
                    id="mobileNumber"
                    type="text"
                    className="form-control mb-4"
                    placeholder="Enter Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-center">
                <button type="submit" className="mt-4 btn submit_button w-auto mb-4">
                <span>Create Lead</span>
                </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUsers;
