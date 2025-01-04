import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../../../axiosInstance';

const AddSubCategory = () => {
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // To store existing subcategories
  const navigate = useNavigate();
  const storedId = localStorage.getItem("clients_Id");


  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/category/getbycategory/${storedId}`);
        setCategories(response.data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load categories.',
          confirmButtonText: 'OK',
        });
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!categoryId) {
        setSubcategories([]);
        return;
      }
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/api/subcategories/${categoryId}`);
        setSubcategories(response.data); // Assuming the response is an array of subcategories
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load subcategories.',
          confirmButtonText: 'OK',
        });
      }
    };
    fetchSubcategories();
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId || !subCategoryName) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all fields.',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/api/subcategories/create/${categoryId}`,
        null,
        {
          params: { name: subCategoryName },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'SubCategory Created',
        text: `SubCategory "${response.data.name}" created successfully!`,
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        setCategoryId('');
        setSubCategoryName('');
        setSubcategories([]); // Clear subcategories after successful submission
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to create SubCategory: ${error.response?.data?.message || error.message}`,
        confirmButtonText: 'OK',
        // showConfirmButton: false,
        // timer: 1000,
      });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-12 col-md-10 col-lg-10 col-xl-8 col-xxl-8">
          <div className="card">
            <div className="card-body mt-10">
              <h2 className="mb-4 text-center">Create SubCategory</h2>
              <form onSubmit={handleSubmit}>
                {/* Dropdown to select category */}
                <div className="mb-3">
                  <label htmlFor="categorySelect" className="form-label">Select Category</label>
                  <select
                    id="categorySelect"
                    className="form-select"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    <option value="">Choose a category</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Input for subcategory name */}
                <div className="mb-3">
                  <label htmlFor="subCategoryName" className="form-label">SubCategory Name</label>
                  <input
                    id="subCategoryName"
                    type="text"
                    className="form-control"
                    placeholder="Enter subcategory name"
                    value={subCategoryName}
                    onChange={(e) => setSubCategoryName(e.target.value)}
                    required
                  />
                </div>

                {/* Display existing subcategories */}
                {subcategories.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label">Existing SubCategories</label>
                    <ul className="list-group">
                      {subcategories
                        .filter((sub) =>
                          sub.name.toLowerCase().includes(subCategoryName.toLowerCase())
                        )
                        .map((sub) => (
                          <li key={sub.subCategoryId} className="list-group-item">
                            {sub.name}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Centered submit button */}
                <div className="d-flex justify-content-center">
                  <button type="submit" className="mt-4 btn submit_button w-auto">
                    <span>Create SubCategory</span>
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

export default AddSubCategory;
