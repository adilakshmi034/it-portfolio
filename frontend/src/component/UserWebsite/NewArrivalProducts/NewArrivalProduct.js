import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import CategoryScroller from "../CategoryScroller/CategoryScroller";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./NewArrivalProduct.css";
import axiosInstance from "../../../axiosInstance";

const NewArrivalProduct = ({ selectedSubcategory, searchQuery }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedRating, setSelectedRating] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/category/all`
        );
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = useMemo(() => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth()-3);

    return categories.flatMap((category) =>
      category.subcategories.flatMap((subcategory) =>
        subcategory.products.filter((product) => {
          const createdAtDate = new Date(product.createdAt);
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
          const isRecent = createdAtDate >= threeMonthsAgo;

          return (
            isRecent &&
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

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
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
  }, [filteredProducts, sortBy]);

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

  const truncateDescription = (description, maxLength = 100) => {
    const safeDescription = description || "";
    return safeDescription.length > maxLength
      ? `${safeDescription.slice(0, maxLength)}...`
      : safeDescription;
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

  return (
    <div className="NewArrivalCon">
      <div className="container CardContainer mt-5 align-items-center">
        <div className="NewArrival mb-5">
          <h1>
            <b>New & Now</b>
          </h1>
          <p>Get the edge with fresh tools. ⏳</p>
          <p>
            Uncover the <b>latest solutions</b> for your business needs! ✨
          </p>
        </div>
        <div className="row">
          <CategoryScroller
            categories={categories}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
        <div className="row mb-4 mt-5 align-items-center justify-content-between">
          <div className="col-auto">
            <span className="product-count">
              {sortedProducts.length} Products
            </span>
          </div>
          <div className="col-auto d-flex">
            <label htmlFor="sortBy" className="form-label mb-0 me-2 SortTxt">
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
            // Find the category and subcategory for each product
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
                className="col-md-4 col-sm-6 col-12 col-lg-3 col-xl-3 mb-4"
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
                      {product.productDescription?.length > 100 && (
                        <Link
                          to={`/ProductDetails/${product.productId}`}
                          className="read-more-link"
                          state={{
                            categoryName:
                              productCategory?.name || "Unknown Category",
                            subCategoryName:
                              productSubcategory?.name || "Unknown Subcategory",
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
      </div>
    </div>
  );
};

export default NewArrivalProduct;
