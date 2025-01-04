import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserSidebar from "../UserWebsite/UserSidebar/UserSidebar";
import ProductGrid from "../UserWebsite/ProductGrid/ProductGrid";
import axios from "axios";
import "./UserWebsite.css";
import axiosInstance from "../../axiosInstance";

function UserWebsite() {
  const [categories, setCategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedRating, setSelectedRating] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const location = useLocation();
  const searchQuery = location.state?.searchQuery || "";

  const [isSidebarVisible, setIsSidebarVisible] = useState(
    window.innerWidth >= 768 
  );

  // Fetch categories with error handling
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/category/categories/all`
        );
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load categories. Please try again later.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Update sidebar visibility on screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarVisible(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  const handleFilterChange = (filters) => {
    setSelectedSubcategory(filters.subcategory);
    setSelectedRating(filters.rating);
    setPriceRange(filters.priceRange);
  };

  const handleClearFilters = () => {
    setSelectedSubcategory(null);
    setSelectedRating("");
    setPriceRange({ min: "", max: "" });
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
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

  if (error) return <div>{error}</div>;

  return (
    <div className="main-containers">
      <div
        className={`sidebar-container ${isSidebarVisible ? "visible-sidebar" : "hidden-sidebar"}`}
      >
        <UserSidebar
          categories={categories}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          sortBy={sortBy}
          closeSidebar={() => setIsSidebarVisible(false)}
        />
      </div>

      {/* Product Grid */}
      <div className="product-grid-container container-fluid">
        <ProductGrid
          categories={categories}
          selectedSubcategory={selectedSubcategory}
          priceRange={priceRange}
          selectedRating={selectedRating}
          searchQuery={searchQuery}
          sortBy={sortBy}
          openSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
}

export default UserWebsite;
