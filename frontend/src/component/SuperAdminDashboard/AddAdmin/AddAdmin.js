import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AddAdmin.css';
import axiosInstance from '../../../axiosInstance';

const AddAdmin = ({ superAdminId }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const storedId = localStorage.getItem("clients_Id");
  

  const validate = (name, value) => {
    const errors = {};
    if (name === 'fullName') {
      if (!value.trim()) {
        errors.fullName = 'Full name is required.';
      } else if (value.length < 3) {
        errors.fullName = 'Full name must be at least 3 characters.';
      }
    }

    if (name === 'email') {
      if (!value.trim()) {
        errors.email = 'Email is required.';
      } else if (!/^\S+@gmail\.com$/.test(value)) {
        errors.email = 'Invalid email format.';
      }
    }

    if (name === 'mobileNumber') {
      if (!value.trim()) {
        errors.mobileNumber = 'Mobile number is required.';
      } else if (!/^[1-9][0-9]{9}$/.test(value)) {
        errors.mobileNumber = 'Enter a valid mobile number.';
      }
    }

    setErrors(errors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'fullName') setFullName(value);
    if (name === 'email') setEmail(value);
    if (name === 'mobileNumber') setMobileNumber(value);

    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    setIsLoading(true); // Start the loader
    try {
      const response = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/api/clients/saveAdminSales/${storedId}`, {
        fullName,
        email,
        mobileNumber,
        role:"ROLE_ADMIN"

      },
      // {
      //   headers:{
      //     Authorization:localStorage.getItem("jwt")
      //   }
      // }
      
    );

      Swal.fire({
        title: 'Success!',
        text: 'Admin created successfully!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
      });

      setFullName('');
      setEmail('');
      setMobileNumber('');
      setErrors({});
    } catch (error) {
      Swal.fire({
        title: 'Something Went Wrong!',
        icon: 'error',
        text: error?.response?.data || error?.response?.data?.message || 'Try again',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsLoading(false); // Stop the loader
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-12 col-md-10 col-lg-10 col-xl-8 col-xxl-8">
          <div className="card">
            <div className="card-body mt-3">
              <h2 className="mb-4 text-center">Create Admin</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    className={`form-control mb-4 ${errors.fullName ? 'is-invalid' : ''}`}
                    placeholder="Enter Full Name"
                    value={fullName}
                    onChange={handleInputChange}
                    name="fullName"
                    required
                  />
                  {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-control mb-4 ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter Email"
                    value={email}
                    onChange={handleInputChange}
                    name="email"
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="mobileNumber" className="form-label">Mobile Number</label>
                  <input
                    id="mobileNumber"
                    type="text"
                    className={`form-control mb-4 ${errors.mobileNumber ? 'is-invalid' : ''}`}
                    placeholder="Enter Mobile Number"
                    value={mobileNumber}
                    onChange={handleInputChange}
                    name="mobileNumber"
                    required
                  />
                  {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber}</div>}
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="mt-4 btn submit_button w-auto mb-4">
                    <span>Create Admin</span>
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

export default AddAdmin;
