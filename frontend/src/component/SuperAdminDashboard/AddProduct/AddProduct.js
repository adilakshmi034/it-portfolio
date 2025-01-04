import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS for styling
import "./AddProduct.css"; // Ensure you have the necessary styles
import axiosInstance from "../../../axiosInstance";

const AddProduct = () => {
  // State hooks for form inputs
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState(""); // State for selected subcategory
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // State for subcategories
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const storedId = localStorage.getItem("clients_Id");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [showSubcategorySuggestions, setShowSubcategorySuggestions] =
    useState(false);
  const [imageError, setImageError] = useState(""); // State for image validation errors

  // Ref for file input
  const fileInputRef = useRef(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/category/getbycategory/${storedId}`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, [storedId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Check if a file was selected
    if (file) {
      const fileSize = file.size / 1024 / 1024; // Convert bytes to MB
      const fileType = file.type;

      // Reset image error message
      setImageError("");

      // Validate file size (must be 2MB or less)
      if (fileSize > 2) {
        setImageError("The image size must be 2MB or below.");
        setImage(null); // Clear the image input field
        return;
      }

      // Validate file type (must be JPEG or PNG)
      if (fileType !== "image/jpeg" && fileType !== "image/png" ) {
        setImageError("Upload only valid image format (JPEG/PNG only).");
        setImage(null); // Clear the image input field
        return;
      }

      // If validations pass, set the image
      setImage(file);
    }
  };

  // Fetch subcategories when categoryId changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (categoryId) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/subcategories/${categoryId}`
          );
          setSubcategories(response.data);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setSubcategories([]);
        }
      } else {
        setSubcategories([]);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  // Handle category input change for suggestions
  const handleCategoryInputChange = (e) => {
    const value = e.target.value;
    setNewCategoryName(value);

    if (value.trim()) {
      const suggestions = categories.filter((category) =>
        category.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(suggestions);
      setShowCategorySuggestions(true);
    } else {
      setFilteredCategories([]);
      setShowCategorySuggestions(false);
    }
  };

  // Handle category suggestion click
  const handleCategorySuggestionClick = (category) => {
    setNewCategoryName(category.name);
    setShowCategorySuggestions(false);
  };

  // Handle subcategory input change for suggestions
  const handleSubcategoryInputChange = (e) => {
    const value = e.target.value;
    setNewSubcategoryName(value);

    if (value.trim()) {
      const suggestions = subcategories.filter((subcategory) =>
        subcategory.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSubcategories(suggestions);
      setShowSubcategorySuggestions(true);
    } else {
      setFilteredSubcategories([]);
      setShowSubcategorySuggestions(false);
    }
  };

  // Handle subcategory suggestion click
  const handleSubcategorySuggestionClick = (subcategory) => {
    setNewSubcategoryName(subcategory.name);
    setShowSubcategorySuggestions(false);
  };

  // Handle category change from dropdown
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    setCategoryId(selectedCategoryId);
    setSubcategoryId(""); // Reset subcategory selection
  };

  // Handle image file change
  // const handleImageChange = (e) => {
  //   setImage(e.target.files[0]);
  // };

  // Handle product form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subcategoryId) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Please select a subcategory.",
        confirmButtonText: "OK",
        showConfirmButton: false, // Hides the OK button
        timer: 1000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("price", price);
    formData.append("discountPrice", discountPrice);
    formData.append("rating", rating);
    formData.append("categoryId", categoryId); // Add category ID to form data
    formData.append("subcategoryId", subcategoryId); // Add subcategory ID to form data

    try {
      // Post data to the server
      await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/api/products/create/${subcategoryId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product created successfully!",
        // confirmButtonText: "Okay",
        showConfirmButton: false,
        timer: 1000,
      });

      // Reset form after successful submission
      setProductName("");
      setProductDescription("");
      setPrice("");
      setDiscountPrice("");
      setRating("");
      setImage(null);
      setCategoryId("");
      setSubcategoryId(""); // Reset subcategory

      // Clear the file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    } catch (error) {
      console.error("Error creating product:", error);
      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Failed to create product.",
        // confirmButtonText: "Try Again",
        showConfirmButton: false, // Hides the OK button
        timer: 1000,
      });
    }
  };

  // Handle category creation
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Category name cannot be empty.",
        // confirmButtonText: "OK",
        showConfirmButton: false,
        timer: 1000,
      });
      
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/api/category/create/${storedId}`,
        null,
        {
          params: { name: newCategoryName },
        }
      );

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Category Created",
        text: `Category "${response.data.name}" created successfully!`,
        // confirmButtonText: "OK",
        showConfirmButton: false,
        timer: 1000,
      });

      // Update categories list
      setCategories((prevCategories) => [...prevCategories, response.data]);

      // Reset form fields
      setNewCategoryName("");
      setShowAddCategory(false);
    } catch (error) {
      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: `Error creating category: ${
          error.response?.data?.message || error.message
        }`,
        // confirmButtonText: "OK",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  // Handle subcategory creation
  const handleCreateSubcategory = async (e) => {
    e.preventDefault();

    if (!newSubcategoryName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Subcategory name cannot be empty.",
        // confirmButtonText: "OK",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    if (!categoryId) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Please select a category before adding a subcategory.",
        // confirmButtonText: "OK",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    try {
      // API call to create subcategory
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/api/subcategories/create/${categoryId}`,
        null,
        {
          params: { name: newSubcategoryName },
        }
      );

      // Show success alert
      Swal.fire({
        icon: "success",
        title: "Subcategory Created",
        text: `Subcategory "${response.data.name}" created successfully!`,
        showConfirmButton: false,
        timer: 1000,
        // confirmButtonText: "OK",
      });

      // Update subcategories list
      setSubcategories((prev) => [...prev, response.data]);

      // Reset form fields
      setNewSubcategoryName("");
      setShowAddSubcategory(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: `Failed to create Subcategory: ${
          error.response?.data?.message || error.message
        }`,
        // confirmButtonText: "OK",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-sm-12 col-md-10 col-lg-8 col-xl-8 col-xxl-8">
          <div className="card">
            <div
              className="card-body"
              style={{ maxHeight: "600px", overflowY: "auto" }}
            >
              <form onSubmit={handleSubmit} className="p-4">
                <h2 className="text-center mb-4">Create Product</h2>

                {/* Product Name */}
                <div className="mb-3">
                  <label className="form-label">Product Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>

                {/* Product Description */}
                <div className="mb-3">
                  <label className="form-label">Product Description:</label>
                  <textarea
                    className="form-control"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <label className="form-label">Price:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                {/* Discount Price */}
                <div className="mb-3">
                  <label className="form-label">Discount %:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                  />
                </div>

                {/* Rating */}
                <div className="mb-3">
                  <label className="form-label">Rating:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    min="1"
                    max="5"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Image:</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                    ref={fileInputRef} // Attach ref to input
                    required
                  />
                  {imageError && (
                    <div
                      className="text-danger mt-2"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {imageError}
                    </div>
                  )}
                </div>

                {/* Category Selection */}
                <div className="mb-3 d-flex align-items-center position-relative">
                  <div className="flex-grow-1 me-2">
                    <label htmlFor="category" className="form-label">
                      Category
                    </label>
                    <select
                      id="category"
                      className="form-select"
                      value={categoryId}
                      onChange={handleCategoryChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn AddBtn"
                      onClick={() => setShowAddCategory(true)}
                    >
                      Add
                    </button>
                  </div>
                </div>
                {showAddCategory && (
                  <div className="mb-3 position-relative">
                    <label className="form-label">New Category Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCategoryName}
                      onChange={handleCategoryInputChange}
                      required
                      autoComplete="off"
                    />
                    {showCategorySuggestions &&
                      filteredCategories.length > 0 && (
                        <ul
                          className="list-group position-absolute w-100"
                          style={{
                            cursor: "pointer",
                            zIndex: 9999,
                            top: "100%",
                            left: 0,
                            width: "100%",
                            maxHeight: "200px",
                            overflowY: "auto",
                            backgroundColor: "white",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            padding: "5px 0",
                            boxSizing: "border-box",
                          }}
                        >
                          {filteredCategories.map((category) => (
                            <li
                              key={category.categoryId}
                              className="list-group-item list-group-item-action"
                              onClick={() =>
                                handleCategorySuggestionClick(category)
                              }
                              style={{
                                cursor: "pointer",
                                padding: "8px 12px",
                              }}
                            >
                              {category.name}
                            </li>
                          ))}
                        </ul>
                      )}

                    <div className="mt-2">
                      <button
                        className="btn Add-buttons me-2"
                        onClick={handleCreateCategory}
                      >
                        Add Category
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowAddCategory(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Subcategory Selection */}
                <div className="mb-3 d-flex align-items-center position-relative">
                  <div className="flex-grow-1 me-2">
                    <label htmlFor="subcategory" className="form-label">
                      Subcategory
                    </label>
                    <select
                      id="subcategory"
                      className="form-select"
                      value={subcategoryId}
                      onChange={(e) => setSubcategoryId(e.target.value)}
                      required
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories.map((subcategory) => (
                        <option
                          key={subcategory.subCategoryId}
                          value={subcategory.subCategoryId}
                        >
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn AddBtn"
                      onClick={() => setShowAddSubcategory(true)}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Add Subcategory Form with Suggestions */}
                {showAddSubcategory && (
                  <div className="mb-3 position-relative">
                    <label className="form-label">New Subcategory Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newSubcategoryName}
                      onChange={handleSubcategoryInputChange}
                      required
                      autoComplete="off"
                    />
                    {/* Suggestions Dropdown */}
                    {showSubcategorySuggestions &&
                      filteredSubcategories.length > 0 && (
                        <ul className="list-group position-absolute w-100 z-index-100">
                          {filteredSubcategories.map((subcategory) => (
                            <li
                              key={subcategory.subCategoryId}
                              className="list-group-item list-group-item-action"
                              onClick={() =>
                                handleSubcategorySuggestionClick(subcategory)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              {subcategory.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    <div className="mt-2">
                      <button
                        className="btn Add-buttons me-2"
                        onClick={handleCreateSubcategory}
                      >
                        Add Subcategory
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowAddSubcategory(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn submit_button mt-4 w-auto"
                  >
                    <span>Create Product</span>
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

export default AddProduct;
