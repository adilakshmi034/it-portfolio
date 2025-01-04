import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../SuperAdminDashboard/AddAdmin/AddAdmin.css';
import axiosInstance from '../../../axiosInstance';

const AddSales = ({ adminId }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errors, setErrors] = useState({});
  const storedId = localStorage.getItem("clients_Id");

  // Validation function
  const validate = (field, value) => {
    const newErrors = { ...errors };

    if (field === 'fullName') {
      if (!value.trim()) {
        newErrors.fullName = 'Full name is required.';
      } else if (value.length < 3) {
        newErrors.fullName = 'Full name must be at least 3 characters.';
      } else {
        delete newErrors.fullName;
      }
    }

    if (field === 'email') {
      if (!value.trim()) {
        newErrors.email = 'Email is required.';
      } else if (!/^\S+@gmail\.com$/.test(value)) {
        newErrors.email = 'Invalid email format.';
      } else {
        delete newErrors.email;
      }
    }

    if (field === 'mobileNumber') {
      if (!value.trim()) {
        newErrors.mobileNumber = 'Mobile number is required.';
      } else if (!/^[1-9][0-9]{9}$/.test(value)) {
        newErrors.mobileNumber = 'Enter valid mobile number';
      } else {
        delete newErrors.mobileNumber;
      }
    }

    setErrors(newErrors); // Update errors state
  };

  // Handle input change and validation on each field
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update state for each field
    if (name === 'fullName') {
      setFullName(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'mobileNumber') {
      setMobileNumber(value);
    }

    // Validate the field on change
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submitting
    if (Object.keys(errors).length > 0) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please correct the highlighted fields.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    try {
      await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/clients/saveAdminSales/${storedId}`, {
        fullName,
        email,
        mobileNumber,
         role: "ROLE_SALES"
      });

      Swal.fire({
        title: 'Success!',
        text: 'Sales user created successfully!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
      });

      // Clear form inputs
      setFullName('');
      setEmail('');
      setMobileNumber('');
    } catch (error) {
      console.error(error);
      const errorMessage =
        error?.response?.data || error?.response?.data?.message || 'Failed to create sale. Please try again.';
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-8 col-md-8 col-lg-6 col-xl-6 col-xxl-6">
          <div className="card">
            <div className="card-body mt-3">
              <h2 className="mb-4 text-center">Create Sales</h2>
              <form onSubmit={handleSubmit}>
                {/* Full Name Field */}
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-control mb-4"
                    placeholder="Enter Full Name"
                    value={fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && <span className="text-danger">{errors.fullName}</span>}
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control mb-4"
                    placeholder="Enter Email"
                    value={email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="text-danger">{errors.email}</span>}
                </div>

                {/* Mobile Number Field */}
                <div className="mb-3">
                  <label htmlFor="mobileNumber" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="text"
                    className="form-control mb-4"
                    placeholder="Enter Mobile Number"
                    value={mobileNumber}
                    onChange={handleChange}
                  />
                  {errors.mobileNumber && <span className="text-danger">{errors.mobileNumber}</span>}
                </div>

                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn submit_button mt-4 w-auto mb-4">
                    <span>Create Sales</span>
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

export default AddSales;
