import React, { useState, useRef, useEffect } from "react";
import Skeleton from "react-loading-skeleton"; // You can install this package for an easy skeleton loader
import "./CategoryScroller.css";

const CategoryScroller = ({ categories, setSelectedCategory, loading }) => {
  const scrollRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState({
    name: "All Products",
    categoryId: null,
  });

  // Handle category button click
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSelectedCategory(category.categoryId);
  };

  // Scroll container scroll to the left
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  // Scroll container scroll to the right
  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Duplicate categories logically for seamless scrolling
  const duplicatedCategories = [...categories];

  // Render Skeleton Loader while loading
  const renderSkeletonLoader = () => {
    return (
      <div className="category-scroll-container">
        <Skeleton height={40} width={150} style={{ marginRight: '10px' }} />
        <Skeleton height={40} width={150} style={{ marginRight: '10px' }} />
        <Skeleton height={40} width={150} style={{ marginRight: '10px' }} />
        <Skeleton height={40} width={150} style={{ marginRight: '10px' }} />
      </div>
    );
  };

  return (
    <div className="category-scroller-wrapper">
      {/* Scroll buttons */}
      <button className="scroll-button left" onClick={handleScrollLeft}>
        &lt; {/* Left Arrow */}
      </button>

      {/* Scrollable category list */}
      {loading ? (
        renderSkeletonLoader() // Show skeleton loader if data is loading
      ) : (
        <div className="category-scroll-container" ref={scrollRef}>
          {/* "All Products" button */}
          <button
            className={`category-button ${activeCategory.name === "All Products" ? "active-scroll" : ""}`}
            onClick={() => handleCategoryClick({ name: "All Products", categoryId: null })}
          >
            All Products
          </button>

          {/* Other category buttons */}
          {duplicatedCategories.map((category) => (
            <button
              key={category.categoryId}
              className={`category-button ${activeCategory.name === category.name ? "active-scroll" : ""}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Scroll buttons */}
      <button className="scroll-button right" onClick={handleScrollRight}>
        &gt; {/* Right Arrow */}
      </button>
    </div>
  );
};

export default CategoryScroller;
