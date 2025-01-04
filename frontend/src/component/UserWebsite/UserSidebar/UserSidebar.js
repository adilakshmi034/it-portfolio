import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faTimes } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserSidebar.css";

const UserSidebar = ({ onFilterChange, isCollapsed, categories, onClearFilters,closeSidebar }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSections, setExpandedSections] = useState({ price: true, rating: true });
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // const toggleCategory = (categoryId) => {
  //   setExpandedCategories((prev) => ({
  //     ...prev,
  //     [categoryId]: !prev[categoryId],
  //   }));
  // };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };
  
  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => {
      const newExpandedCategories = { ...prev };
  
      // If the clicked category is already open, close it
      if (newExpandedCategories[categoryId]) {
        newExpandedCategories[categoryId] = false;
      } else {
        // Otherwise, close all categories and open the clicked one
        Object.keys(newExpandedCategories).forEach((id) => {
          newExpandedCategories[id] = false;
        });
        newExpandedCategories[categoryId] = true;
      }
  
      return newExpandedCategories;
    });
  };
  
  
  
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const updatedPriceRange = { ...priceRange, [name]: value };
    setPriceRange(updatedPriceRange);
    onFilterChange({ priceRange: updatedPriceRange, rating: selectedRating, subcategory: selectedSubcategory });
  };

  const handleRatingChange = (e) => {
    setSelectedRating(e.target.value);
    onFilterChange({ priceRange, rating: e.target.value, subcategory: selectedSubcategory });
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    onFilterChange({ priceRange, rating: selectedRating, subcategory: subcategoryId });
  };

  const handleClearFilters = () => {
    setPriceRange({ min: "", max: "" });
    setSelectedRating("");
    setSelectedSubcategory(null);
    onClearFilters(); // Calling the parent function to reset filters
  };

  return (
    <div className={`user-sidebar bg-white ${isCollapsed ? "collapsed" : ""}`}>
    <div className="close-sidebar-btn d-md-none" onClick={closeSidebar}>
        <FontAwesomeIcon icon={faTimes} />
      </div>
      <div className="section-container">
        {!isCollapsed && <h4 className="mb-3 mt-2  fw-bold section-header">Shop by Category</h4>}
        <div className="category-section">
          {categories.map((category) => (
            <div key={category.categoryId} className="mb-2">
              <div
                className={`d-flex justify-content-between align-items-center categoryHeading ${isCollapsed ? "collapsed-category" : ""}`}
                onClick={() => toggleCategory(category.categoryId)}
                style={{ cursor: "pointer" }}
              >
                {category.name}
                {!isCollapsed && (
                  <FontAwesomeIcon icon={expandedCategories[category.categoryId] ? faChevronUp : faChevronDown} />
                )}
              </div>
              {!isCollapsed && expandedCategories[category.categoryId] && (
                <div className="ms-3">
                  {category.subcategories.map((subcategory) => (
                    <div
                      key={subcategory.subCategoryId}
                      className={`ms-2 ${selectedSubcategory === subcategory.subCategoryId ? "selected-subcategory" : ""}`}
                      onClick={() => handleSubcategoryClick(subcategory.subCategoryId)}
                      style={{ cursor: "pointer" }}
                    >
                      {subcategory.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="section-container mt-2 mb-3">
        <div className="d-flex justify-content-between align-items-center">
          {!isCollapsed && <h5 className="section-header">Price Range</h5>}
          <FontAwesomeIcon icon={expandedSections.price ? faChevronUp : faChevronDown} onClick={() => toggleSection("price")} style={{ cursor: "pointer" }} />
        </div>
        {expandedSections.price && !isCollapsed && (
          <div className="row mt-2 gx-2">
            <div className="col-6">
              <input
                type="number"
                name="min"
                className="form-control"
                placeholder="Min"
                value={priceRange.min}
                onChange={handlePriceChange}
              />
            </div>
            <div className="col-6">
              <input
                type="number"
                name="max"
                className="form-control"
                placeholder="Max"
                value={priceRange.max}
                onChange={handlePriceChange}
              />
            </div>
          </div>
        )}
      </div>
      <div className="section-container">
        <div className="d-flex justify-content-between align-items-center">
          {!isCollapsed && <h5 className="section-header">Filter by Rating</h5>}
          <FontAwesomeIcon icon={expandedSections.rating ? faChevronUp : faChevronDown} onClick={() => toggleSection("rating")} style={{ cursor: "pointer" }} />
        </div>
        {expandedSections.rating && !isCollapsed && (
          <div className="mt-2">
            <select className="form-select w-100" value={selectedRating} onChange={handleRatingChange}>
              <option value="">Select Rating</option>
              <option value="1">1 Star & Up</option>
              <option value="2">2 Stars & Up</option>
              <option value="3">3 Stars & Up</option>
              <option value="4">4 Stars & Up</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
        )}
      </div>
      {!isCollapsed && (
        <div className="d-grid mt-3">
          <button className="btn btn-secondary" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default UserSidebar;
