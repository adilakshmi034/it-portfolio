import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../axiosInstance";
import Swal from "sweetalert2"; // Import SweetAlert
import { useNavigate } from "react-router-dom";
import "./AddCategory.css";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState(""); // State for category name
  const [categories, setCategories] = useState([]); // State for existing categories
  const [filteredCategories, setFilteredCategories] = useState([]); // State for filtered categories
  const [dropdownVisible, setDropdownVisible] = useState(false); // State to control dropdown visibility
  const storedId = localStorage.getItem("clients_Id");
  const navigate = useNavigate();

  // Fetch existing categories when the component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/category/getbycategory/${storedId}`
        );
        setCategories(response.data); // Set the categories from the response
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, [storedId]);

  // Handle the category input change (for suggestions and filtering)
  const handleCategoryChange = (e) => {
    const inputValue = e.target.value;
    setCategoryName(inputValue);

    // Filter categories based on input value
    if (inputValue) {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCategories(filtered); // Set the filtered categories based on the user input
      setDropdownVisible(true); // Show the dropdown when there's user input
    } else {
      setFilteredCategories([]); // Clear the filtered categories when the input is empty
      setDropdownVisible(false); // Hide the dropdown when the input is empty
    }
  };

  // Handle category suggestion click
  const handleCategorySelect = (selectedCategory) => {
    setCategoryName(selectedCategory.name); // Set the category name to the selected one
    setFilteredCategories([]); // Clear filtered categories after selection
    setDropdownVisible(false); // Hide the dropdown after a selection
  };

  // Handle form submission to create a new category
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/api/category/create/${storedId}`,
        null, // No body needed as data is passed in params
        {
          params: { name: categoryName },
        }
      );

      // Show success alert
      Swal.fire({
        icon: 'success',
        title: 'Category Created',
        text: `Category "${response.data.name}" created successfully!`,
        // confirmButtonText: 'OK',
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        // Navigate to the category list after alert is confirmed
        navigate('/SuperAdminDashboard/AddCategory');
      });

      setCategoryName(""); // Clear the input field after submission
      setFilteredCategories([]); // Clear filtered categories after submission
      setDropdownVisible(false); // Hide the dropdown after submission
    } catch (error) {
      // Show error alert
      Swal.fire({
        icon: 'error',
        title: 'Something went happened',
        text: `Error creating category: ${error.response?.data?.message || error.message}`,
        confirmButtonText: 'OK',
      });
    }
  };

  // Handle clicking the dropdown icon to toggle visibility of the dropdown
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible); // Toggle visibility of the dropdown
    if (!dropdownVisible && categoryName === "") {
      setFilteredCategories(categories); // Show all categories if input is empty
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-12 col-md-10 col-lg-8 col-xl-8 col-xxl-8">
          <div className="card">
            <div className="card-body mt-10">
              <h2 className="mb-4 text-center">Create Category</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3 position-relative">
                  <label className="form-label">Category Name</label>
                  <div className="input-group">
                    <input
                      id="categoryName"
                      type="text"
                      className="form-control"
                      placeholder="Enter category name"
                      value={categoryName}
                      onChange={handleCategoryChange}
                      required
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={toggleDropdown}
                    >
                      ▼
                    </button>
                  </div>
                  {dropdownVisible && (
                    <ul className="suggestions-lists">
                
                      {(categoryName ? filteredCategories : categories).length > 0 ? (
                        (categoryName ? filteredCategories : categories).map((category) => (
                          <li
                            key={category.categoryId}
                            onClick={() => handleCategorySelect(category)}
                          >
                            {category.name}
                          </li>
                        ))
                      ) : (
                        <li>No categories found</li> // Show a message if no categories are found
                      )}
                    </ul>
                  )}
                </div>

                <div className="d-flex justify-content-center">
                  <button type="submit" className="mt-4 btn submit_button w-auto">
                    <span>Create Category</span>
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

export default AddCategory;
