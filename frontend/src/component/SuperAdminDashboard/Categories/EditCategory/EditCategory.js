import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert
import './EditCategory.css';
import axiosInstance from '../../../../axiosInstance';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({ name: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`${process.env.REACT_APP_API_URL}/api/category/getcategory/${id}`)
      .then(response => {
        if (response.data) {
          setCategory({ name: response.data.name });
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching category data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Something went happened',
          text: 'Could not fetch the category details. Please try again.',
        });
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    axiosInstance
      .put(
        `${process.env.REACT_APP_API_URL}/api/category/updatecategory/${id}`,
        { name: category.name },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Category updated successfully!',
          showConfirmButton: false,
        timer: 1000,
        });
        navigate('/SuperAdminDashboard/categorylist');
      })
      .catch(error => {
        console.error('Error updating category:', error);
        Swal.fire({
          icon: 'error',
          title: 'Something went happened',
          text: error || 'Failed to update category. Please try again.',
        });
      });
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="cell d-0"></div>
        <div className="cell d-1"></div>
        <div className="cell d-2"></div>
        <div className="cell d-1"></div>
        <div className="cell d-2"></div>
        <div className="cell d-2"></div>
        <div className="cell d-3"></div>
        <div className="cell d-3"></div>
        <div className="cell d-4"></div>
      </div>
    );
  }


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-12 col-md-10 col-lg-10 col-xl-8 col-xxl-8">
          <div className="card">
            <div className="card-body mt-10">
              <h2 className="mb-4 text-center">Update Category</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Category Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={category.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="mt-4 btn submit_button w-auto">
                    <span>Update Category</span>
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

export default EditCategory;
