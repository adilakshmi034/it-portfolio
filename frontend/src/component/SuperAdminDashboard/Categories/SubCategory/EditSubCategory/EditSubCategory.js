import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "./EditSubCategory.css"
import axiosInstance from '../../../../../axiosInstance';


const EditSubCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subCategory, setSubCategory] = useState({ name: '' });
  const [loading, setLoading] = useState(true); 
  const [categoryId, setCategoryId] = useState(null);

  // Fetch the subcategory details when the component mounts
  useEffect(() => {
    axiosInstance
      .get(`${process.env.REACT_APP_API_URL}/api/subcategories/sub/${id}`)
      .then(response => {
        if (response.data) {
          setSubCategory({ name: response.data.name });
        }
        setLoading(false); // Set loading to false after fetching
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching subcategory data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Something went happened',
          text: 'Could not fetch the subcategory details. Please try again.',
        });
        setLoading(false);
      });
  }, [id]);

  // Handle input change for the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubCategory({ ...subCategory, [name]: value });
  };

  // Handle form submission
  const fetchCategoryId = async (subCategoryId) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_API_URL}/api/subcategories/${subCategoryId}`
      );
      return response.data.categoryId;  // Assuming response contains categoryId
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    axiosInstance
      .put(`${process.env.REACT_APP_API_URL}/api/subcategories/update/${id}`, subCategory, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Subcategory updated successfully!',
          showConfirmButton: false,
          timer: 1000,
        });
  
        // Navigate to subcategory list by category ID
        navigate(`/superadmindashboard/subcategorylist/${id}`);
      })
      .catch(error => {
        console.error('Error updating subcategory:', error);
        Swal.fire({
          icon: 'error',
          title: 'Something went wrong',
          text: error.response?.data?.message || 'Failed to update subcategory. Please try again.',
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
            <div className="card-body">
              <h2 className="mb-4 text-center">Update Subcategory</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Subcategory Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={subCategory.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="mt-4 btn submit_button w-auto">
                    <span>Update Subcategory</span>
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

export default EditSubCategory;
