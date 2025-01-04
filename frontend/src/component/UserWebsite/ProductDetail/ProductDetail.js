import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./ProductDetail.css";
import { FaStar, FaRegStar } from "react-icons/fa";
import UserWebsite from "../UserWebsite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [product, setProduct] = useState(null);
  const { categoryName, subCategoryName } = location.state || {};
  const [firstImage, setFirstImage] = useState("");
  const [otherProducts, setOtherProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check login status from localStorage
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/products/getby/${id}`
        );
        const productData = await response.json();

        setProduct(productData);
        setFirstImage(productData.image);

        // Fetch other products in the same category and subcategory
        setOtherProducts(productData.relatedProducts || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // If the product is not loaded yet, show loading
  if (loading) {
    return (
      <div className="loader-container">
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
      </div>
    );
  }

  const images =
    product.productDetails?.images &&
    Array.isArray(product.productDetails.images)
      ? product.productDetails.images
      : [];

  const mediaItems = [
    {
      type: "image",
      data: firstImage,
      description: product.productDetails?.description,
    },
    ...(images.length > 0
      ? images
          .map((item, index) => {
            if (!item) return null;
            return {
              type: item.videoData ? "video" : "image",
              data: item.videoData || item.imageData,
              description:
                item.videoDescription ||
                item.imageDescription ||
                "No description available",
            };
          })
          .filter(Boolean)
      : []),
  ];

  const handleExpand = () => setIsExpanded(true);
  const handleCollapse = () => setIsExpanded(false);
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : mediaItems.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < mediaItems.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index); // This sets the selected media index
  };

  const path = `${categoryName}/${subCategoryName}/${product.productName}`;

  const handleProductNameClick = () => {
    if (!product?.productName) {
      console.error("Product name is undefined or null");
    }

    navigate(`/ProductRole/${id}/roles`, {
      state: {
        productName: product?.productName || "Unknown Product",
      },
    });
  };

  const truncateDescription = (description, maxLength = 500) => {
    if (description && description.length > maxLength) {
      return description.slice(0, maxLength) + "...";
    }
    return description;
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
    <div className="product-page">
      {searchQuery ? (
        <UserWebsite searchQuery={searchQuery} />
      ) : (
        <div className="container mt-0">
          <div className="row">
            {/* Product Details Column */}
            <div className="col-lg-8 col-md-8 order-2 order-sm-1">
              <div className="product-detail-container">
                <h4 className="product-path">{path}</h4>
                <div
                  className="initial-image-container"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {firstImage && (
                    <img
                      src={`data:image/png;base64,${firstImage}`}
                      alt="First Image"
                      className="initial-image"
                    />
                  )}

                  {isHovered && (
                    <div className="view-more-overlay" onClick={handleExpand}>
                      View More
                    </div>
                  )}
                </div>
                <p className="product-Descriptions mt-4">
                  {product.productDetails?.description}
                </p>
                <div className="product-introduction">
                  <p>
                    Introducing to{" "}
                    {isLoggedIn ? (
                      <span
                        onClick={handleProductNameClick}
                        className="product-link"
                        style={{ cursor: "pointer", color: "#00d5cd" }}
                      >
                        {product.productDetails?.name || "Product Name"}
                      </span>
                    ) : (
                      <span className="product-link" style={{ color: "#ccc" }}>
                        {product.productDetails?.name || "Product Name"}
                      </span>
                    )}
                  </p>
                </div>
                <h1 className="OverView">
                  <strong>Overview</strong>
                </h1>
                {mediaItems.slice(1).map((item, index) => (
                  <div key={index} className="media-item">
                    <div className="media-display">
                      {item.type === "video" ? (
                        <video controls className="modal-media">
                          <source
                            src={`data:video/mp4;base64,${item.data}`}
                            type="video/mp4"
                          />
                        </video>
                      ) : (
                        <img
                          src={`data:image/png;base64,${item.data}`}
                          alt={`Media ${index + 1}`}
                          className="modal-media"
                        />
                      )}
                    </div>
                    {item.description && (
                      <p className="media-description">{item.description}</p>
                    )}
                  </div>
                ))}
                <div className="features-section">
                  <h2>
                    <strong>Features</strong>
                  </h2>
                  <ul>
                    {product.productDetails?.features?.map((feature, index) => (
                      <li key={index}>
                        <span className="checkmark">✔</span>
                        {feature.description}
                      </li>
                    ))}
                  </ul>
                </div>
                {isExpanded && (
                  <div className="expanded-modal">
                    <button
                      className="close-modal-button"
                      onClick={handleCollapse}
                    >
                      &times;
                    </button>

                    <button
                      className="arrow-button left-arrow"
                      onClick={handlePrev}
                    >
                      &#10094;
                    </button>

                    <div className="main-media">
                      {mediaItems[currentIndex]?.type === "video" ? (
                        <video
                          key={currentIndex}
                          controls
                          className="modal-media"
                        >
                          <source
                            src={`data:video/mp4;base64,${mediaItems[currentIndex]?.data}`}
                            type="video/mp4"
                          />
                        </video>
                      ) : (
                        <img
                          src={`data:image/png;base64,${mediaItems[currentIndex]?.data}`}
                          alt={`Media ${currentIndex + 1}`}
                          className="modal-media"
                        />
                      )}
                    </div>

                    <div className="thumbnail-row">
                      {mediaItems.map((item, index) => (
                        <div
                          key={index}
                          className={`thumbnail-container ${
                            item.type === "video"
                              ? "video-thumbnail"
                              : "image-thumbnail"
                          }`}
                        >
                          {item.type === "image" ? (
                            <img
                              src={`data:image/png;base64,${item.data}`}
                              alt={`Thumbnail ${index + 1}`}
                              className={`thumbnail ${
                                index === currentIndex ? "active" : ""
                              }`}
                              onClick={() => handleThumbnailClick(index)}
                            />
                          ) : item.type === "video" ? (
                            <video
                              className={`thumbnail ${
                                index === currentIndex ? "active" : ""
                              }`}
                              poster={
                                item.posterImage
                                  ? `data:image/png;base64,${item.posterImage}`
                                  : "https://via.placeholder.com/150"
                              }
                              onClick={() => handleThumbnailClick(index)}
                              muted
                              loop
                            >
                              <source
                                src={`data:video/mp4;base64,${item.data}`}
                                type="video/mp4"
                              />
                            </video>
                          ) : null}
                        </div>
                      ))}
                    </div>

                    <button
                      className="arrow-button right-arrow"
                      onClick={handleNext}
                    >
                      &#10095;
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Product Card Column */}

            <div className="col-lg-4 col-md-4 order-md-1">
              <div className="products-card top-0 mt-4">
                <div className="Products mb-4" key={product?.productId}>
                  <div className="card CardGrids CardsGrid h-100 w-100">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title">{product?.productName}</h5>
                      <p className="card-text">
                        {truncateDescription(
                          product?.productDescription || "No description"
                        )}
                      </p>
                      <div className="price-rating">
                        {renderStars(product?.rating || 0)}
                        <span className="Rating"> rating</span>
                        <p>
                          <span className="text-success fs-5 fw-bold">
                            ${product?.offerPrice}
                          </span>{" "}
                          <span className="text-muted text-decoration-line-through">
                            ${product?.price}
                          </span>
                          <span className="ms-2 text-danger">
                            ({product?.discountPrice}
                            {/* (
                              {Math.round(
                                ((product?.price - product?.offerPrice) /
                                  product?.price) *
                                  100
                              )} */}
                            % OFF)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
