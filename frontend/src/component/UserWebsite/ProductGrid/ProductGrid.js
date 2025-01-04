import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductGrid.css";
import { FaStar, FaRegStar } from "react-icons/fa";
import NotFound from "../../../assets/bro.png"; // Update this path as needed

const ProductGrid = ({
  categories,
  selectedSubcategory,
  priceRange,
  selectedRating,
  searchQuery,
  products,
  openSidebar,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true); // Define loading state

  // Memoized filtered products based on applied filters
  const filteredProducts = useMemo(() => {
    return categories.flatMap((category) =>
      category.subcategories.flatMap((subcategory) =>
        subcategory.products.filter((product) => {
          const matchesCategory = selectedCategory
            ? category.categoryId === selectedCategory
            : true;
          const matchesSubcategory = selectedSubcategory
            ? subcategory.subCategoryId === selectedSubcategory
            : true;
          const matchesPrice =
            (priceRange.min === "" || product.price >= priceRange.min) &&
            (priceRange.max === "" || product.price <= priceRange.max);
          const matchesRating = selectedRating
            ? product.rating >= selectedRating
            : true;
          const matchesSearchQuery = searchQuery
            ? product.productName
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            : true;

          return (
            matchesCategory &&
            matchesSubcategory &&
            matchesPrice &&
            matchesRating &&
            matchesSearchQuery
          );
        })
      )
    );
  }, [
    categories,
    selectedCategory,
    selectedSubcategory,
    priceRange,
    selectedRating,
    searchQuery,
  ]);

  // All products for "You may also like" fallback
  const allProducts = useMemo(() => {
    return categories.flatMap((category) =>
      category.subcategories.flatMap((subcategory) => subcategory.products)
    );
  }, [categories]);

  useEffect(() => {
    const sorted = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "priceLowToHigh":
          return a.discountPrice - b.discountPrice;
        case "priceHighToLow":
          return b.discountPrice - a.discountPrice;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setSortedProducts(sorted);
    setLoading(false); // Set loading to false after data is sorted
  }, [filteredProducts, sortBy]);

  const truncateDescription = (description, maxLength = 100) => {
    const safeDescription = description || "";
    if (safeDescription.length > maxLength) {
      return safeDescription.slice(0, maxLength) + "...";
    }
    return safeDescription;
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    return (
      <span>
        {Array.from({ length: filledStars }, (_, index) => (
          <FaStar key={index} className="filled-star" />
        ))}
        {halfStar && <FaStar className="half-star" />}
        {Array.from(
          { length: totalStars - filledStars - (halfStar ? 1 : 0) },
          (_, index) => (
            <FaRegStar key={index + filledStars + 1} className="empty-star" />
          )
        )}
      </span>
    );
  };

  // Skeleton loader component for product cards
  const SkeletonLoader = () => (
    <div className="col-md-12 col-sm-12 col-12 col-lg-6 col-xl-4 col-xxl-4 mb-4">
      <div className="card CardGrids h-100">
        <div className="skeletonss skeleton-imgss" />
        <div className="card-body d-flex flex-column justify-content-between">
          <div className="skeletonss skeleton-titless" />
          <div className="skeletonss skeleton-descriptionss" />
          <div className="skeletonss skeleton-pricess" />
          <div className="skeletonss skeleton-buttonss" />
        </div>
      </div>
    </div>
  );

  // Determine if the sidebar filter is applied by checking if there are any selected filters
  const isSidebarFiltered = useMemo(() => {
    return (
      selectedCategory ||
      selectedSubcategory ||
      priceRange.min ||
      priceRange.max ||
      selectedRating
    );
  }, [selectedCategory, selectedSubcategory, priceRange, selectedRating]);

  return (
    <div className="container-fluid CardContainer productGridContainer">
      {loading ? (
        // Display skeletons when loading
        <div className="row">
          {Array(12)
            .fill(null)
            .map((_, idx) => (
              <SkeletonLoader key={idx} />
            ))}
        </div>
      ) : filteredProducts.length === 0 && isSidebarFiltered ? (
        <div className=" h-100 w-100">
          <div className="row mb-4 h-100 w-100">
            <div className="col-12 d-md-none mb-3">
              <button
                className="btn btn-secondary Filtered"
                onClick={openSidebar}
              >
                Filters
              </button>
            </div>
          </div>

          {/* Image Row */}
          <div className="row w-100 justify-content-center">
            <div className="d-flex justify-content-center  h-100  align-items-center ">
              <img
                src={NotFound}
                alt="No products found"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      ) : filteredProducts.length === 0 && searchQuery ? (
        // Show "no results" message for search query
        <div className="no-results">
          <h3>
            <b>Sorry, We couldn't find any results for "{searchQuery}"</b>
          </h3>
          <h4>
            <b>Search tips:</b>
          </h4>
          <ul>
            <li>Try using broader or simpler terms</li>
            <li>Check for typos</li>
            <li>Clear some filters to widen your search</li>
          </ul>
          <div className="row mb-4 align-items-end justify-content-end">
            {/* Filter Button for Small Screens */}
            <div className="d-md-none mb-3">
              <button className="btn btn-secondary" onClick={openSidebar}>
                Filters
              </button>
            </div>
          </div>
          <h3 className="mt-4 fw-bold">You may also like</h3>
          <div className="row">
            {allProducts.map((product) => {
              const productCategory = categories.find((category) =>
                category.subcategories.some((sub) =>
                  sub.products.some((p) => p.productId === product.productId)
                )
              );

              const productSubcategory = productCategory?.subcategories.find(
                (sub) =>
                  sub.products.some((p) => p.productId === product.productId)
              );

              return (
                <div
                  className="col-md-12 col-sm-12 col-12 col-lg-6 col-xl-4 col-xxl-4 mb-4"
                  key={product.productId}
                >
                  <div className="card CardGrids h-100">
                    <img
                      src={`data:image/jpeg;base64,${product.image}`}
                      className="card-img-top"
                      alt={product.productName}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title">{product.productName}</h5>
                      <p className="card-text Description">
                        {truncateDescription(product.productDescription)}
                        {product.productDescription &&
                          product.productDescription.length > 100 && (
                            <Link
                              to={`/ProductDetails/${product.productId}`}
                              className="read-more-link"
                              state={{
                                categoryName:
                                  productCategory?.name || "Unknown Category",
                                subCategoryName:
                                  productSubcategory?.name ||
                                  "Unknown Subcategory",
                              }}
                            >
                              Read More
                            </Link>
                          )}
                      </p>
                      <div className="price-rating">
                        {renderStars(product.rating)}
                        <span className="Rating"> rating</span>
                        <p className="text-success">
                          ${product.discountPrice}{" "}
                          <span className="text-muted text-decoration-line-through">
                            ${product.price}
                          </span>
                        </p>
                      </div>
                      <div className="d-flex justify-content-end align-items-end view-button">
                        <Link
                          to={`/ProductDetails/${product.productId}`}
                          className="btn btn-View"
                          state={{
                            categoryName:
                              productCategory?.name || "Unknown Category",
                            subCategoryName:
                              productSubcategory?.name || "Unknown Subcategory",
                          }}
                        >
                          View{" "}
                          <i className="fas fa-arrow-right ms-2 arrow-icon"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <div className="row mb-4 align-items-center justify-content-between">
            <div className="col-12 col-md-auto">
              <span className="product-count">
                {sortedProducts.length}{" "}
                {sortedProducts.length === 1 ? "Product" : "Products"}
              </span>
            </div>

            {/* Filter Button for Small Screens */}
            <div className="col-3 col-md-auto d-flex d-md-none text-center justify-content-start">
              <button className="btn btn-secondary" onClick={openSidebar}>
                Filters
              </button>
            </div>

            {/* Sort By Dropdown */}
            <div className="col-9 col-md-auto d-flex justify-content-end">
              <label htmlFor="sortBy" className="form-label mb-0 me-1 SortTxt">
                Sort By:
              </label>
              <select
                id="sortBy"
                className="form-select d-inline-block"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Relevant</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
          <div className="row">
            {sortedProducts.map((product) => {
              // Find the category that contains the product
              const productCategory = categories.find((category) =>
                category.subcategories.some((sub) =>
                  sub.products.some((p) => p.productId === product.productId)
                )
              );

              // Find the subcategory that contains the product
              const productSubcategory = productCategory?.subcategories.find(
                (sub) =>
                  sub.products.some((p) => p.productId === product.productId)
              );

              return (
                <div
                  className="col-md-12 col-sm-12 col-12 col-lg-6 col-xl-4 col-xxl-4 mb-4"
                  key={product.productId}
                >
                  <div className="card CardGrids h-100">
                    <img
                      src={`data:image/jpeg;base64,${product.image}`}
                      className="card-img-top"
                      alt={product.productName}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title">{product.productName}</h5>
                      <p className="card-text Description">
                        {truncateDescription(product.productDescription)}
                        {product.productDescription &&
                          product.productDescription.length > 100 && (
                            <Link
                              to={`/ProductDetails/${product.productId}`}
                              className="read-more-link"
                              state={{
                                categoryName:
                                  productCategory?.name || "Unknown Category",
                                subCategoryName:
                                  productSubcategory?.name ||
                                  "Unknown Subcategory",
                              }}
                            >
                              Read More
                            </Link>
                          )}
                      </p>
                      <div className="price-rating">
                        {renderStars(product.rating)}
                        <span className="Rating"> rating</span>
                        <p className="text-success">
                          ${product.offerPrice}{" "}
                          <span className="text-muted text-decoration-line-through">
                            ${product.price}
                          </span>
                        </p>
                      </div>
                      <div className="d-flex justify-content-end align-items-end view-button">
                        <Link
                          to={`/ProductDetails/${product.productId}`}
                          className="btn btn-View"
                          state={{
                            categoryName:
                              productCategory?.name || "Unknown Category",
                            subCategoryName:
                              productSubcategory?.name || "Unknown Subcategory",
                          }}
                        >
                          View{" "}
                          <i className="fas fa-arrow-right ms-2 arrow-icon"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductGrid;
