import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import HeroSections from "../HeroSections/HeroSections";
import { FaStar, FaRegStar, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import ErrorIllustration from "../../../assets/6342468.jpg";
import axiosInstance from "../../../axiosInstance";

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [cardsPerView, setCardsPerView] = useState(3); // Default to 3 cards per view
  const [visibleIndices, setVisibleIndices] = useState({});
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const { setPageError } = useOutletContext();

  // Fetch categories data from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/category/categories/all`
        );
 
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("No data found (404).");
          }
          throw new Error("Network error or server issue.");
        }

        const data = await response.json();
        if (data.length === 0) {
          throw new Error("No categories found.");
        }

        setCategories(data);

        // Initialize visibleIndices for each category
        const indices = data.reduce((acc, category) => {
          const allProducts = category.subcategories.flatMap(
            (sub) => sub.products
          );
          acc[category.categoryId] = 0; // Start with 0 index for each category
          return acc;
        }, {});
        setVisibleIndices(indices);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching categories:", error);
        setPageError(error.message); // Pass error to MainPages
        setLoading(false);
      }
    };

    fetchCategories();

    const updateCardsPerView = () => {
      if (window.innerWidth < 576) setCardsPerView(1);
      else if (window.innerWidth < 992) setCardsPerView(2);
      else if (window.innerWidth < 1200) setCardsPerView(3);
      else setCardsPerView(4);
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);

    return () => window.removeEventListener("resize", updateCardsPerView);
  }, [setPageError]);

  const handleNext = (categoryId) => {
    setVisibleIndices((prev) => {
      const currentIndex = prev[categoryId];
      const maxIndex =
        categories
          .find((category) => category.categoryId === categoryId)
          .subcategories.flatMap((sub) => sub.products).length - cardsPerView;
      const nextIndex =
        currentIndex + cardsPerView > maxIndex
          ? 0
          : currentIndex + cardsPerView;
      return { ...prev, [categoryId]: nextIndex };
    });
  };

  const handlePrev = (categoryId) => {
    setVisibleIndices((prev) => {
      const currentIndex = prev[categoryId];
      const maxIndex =
        categories
          .find((category) => category.categoryId === categoryId)
          .subcategories.flatMap((sub) => sub.products).length - cardsPerView;
      const prevIndex =
        currentIndex - cardsPerView < 0
          ? maxIndex
          : currentIndex - cardsPerView;
      return { ...prev, [categoryId]: prevIndex };
    });
  };

  const renderStars = (rating) => (
    <span>
      {[...Array(5)].map((_, i) =>
        i < Math.floor(rating) ? (
          <FaStar key={i} className="text-warning" />
        ) : (
          <FaRegStar key={i} className="text-muted" />
        )
      )}
    </span>
  );

  const truncateDescription = (description, maxLength = 100) => {
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + "...";
  };

  const ProductCard = ({ product, category, subcategory }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <div key={product.productId} className="ProductCard card mb-3">
        <img
          src={`data:image/jpeg;base64,${product.image}`}
          className="card-img-top ProductCardImage"
          alt={product.productName}
        />
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title">{product.productName}</h5>
          <p className="productdescription text-muted">
            {isExpanded
              ? product.productDescription
              : truncateDescription(product.productDescription)}
            {product.productDescription.length > 100 && !isExpanded && (
              <span className="read_more" onClick={toggleDescription}>
                Read More
              </span>
            )}
            {isExpanded && (
              <span className="read_less" onClick={toggleDescription}>
                ...Read Less
              </span>
            )}
          </p>
          <div>{renderStars(product.rating)}</div>
          <p className="text-success">
            ${product.offerPrice}{" "}
            <span className="text-muted text-decoration-line-through">
              ${product.price}
            </span>
          </p>
          <Link
            to={`/ProductDetails/${product.productId}`}
            className="btn BuyNowButton"
            state={{
              categoryName: category.name,
              subCategoryName: subcategory.name,
            }}
          >
            Know More
          </Link>
        </div>
      </div>
    );
  };

  const SkeletonLoader = () => {
  const totalSkeletons = 5; // Total skeleton cards to be displayed
  const [cardsPerRow, setCardsPerRow] = useState(4); // Default to 4 cards per row

  useEffect(() => {
    const updateCardsPerRow = () => {
      if (window.innerWidth < 576) setCardsPerRow(1); // 1 card per row for small screens
      else if (window.innerWidth < 992) setCardsPerRow(2); // 2 cards per row for medium screens
      else if (window.innerWidth < 1200) setCardsPerRow(3); // 3 cards per row for large screens
      else setCardsPerRow(4); // 4 cards per row for extra large screens
    };

    updateCardsPerRow(); // Set initial number of cards per row
    window.addEventListener("resize", updateCardsPerRow); // Update on resize

    return () => window.removeEventListener("resize", updateCardsPerRow); // Cleanup on unmount
  }, []);

  return (
    <div className="category-section m-5 px-3 position-relative">
      {/* Skeleton Title */}
      <div className="skeleton-title skeleton mb-3"></div>

      <div className="position-relative">
        {/* Skeleton Left Arrow */}
        <div className="carousel-arrow skeleton-arrow left-arrows">
          <span className="arrow-symbol">←</span>
        </div>

        {/* Skeleton Cards in Grid Layout */}
        <div className="carousel-inner grid-layout" style={{ gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)` }}>
          {Array.from({ length: totalSkeletons }).map((_, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="ProductCard-skeletons">
                <div className="skeleton-images"></div>
                <div className="card-body d-flex flex-column">
                  <div className="skeleton-titles"></div>
                  <div className="skeleton-descriptions"></div>
                  <div className="skeleton-prices"></div>
                  <div className="skeleton-buttons">Know More</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton Right Arrow */}
        <div className="carousel-arrow skeleton-arrow right-arrows">
          <span className="arrow-symbol">→</span>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className="container-fluid m-0 px-0">
      {/* Render HeroSection only if there is no error */}
      {!error && <HeroSections categories={categories} />}

      {loading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <SkeletonLoader key={index} />
        ))
      ) : error ? (
        <div className="error-message text-center">
          <img
            src={ErrorIllustration}
            alt="404 Error"
            className="img-fluid"
            style={{ maxWidth: "300px" }}
            
          />

          <p>Oops! We couldn't find any data. Please try again later.</p>
        </div>
        
      ) : (
        categories
          .filter(
            (category) =>
              category.subcategories.flatMap(
                (subcategory) => subcategory.products
              ).length > 0
          )
          .map((category) => {
            const allProducts = category.subcategories.flatMap(
              (subcategory) => subcategory.products
            );

            return (
              <div
                key={category.categoryId}
                className="category-section m-5 px-3"
              >
                <h4 className="mb-3">{category.name}</h4>

                <div className="position-relative">
                  <button
                    className="btn carousel-arrow left-arrows"
                    onClick={() => handlePrev(category.categoryId)}
                  >
                    <FaArrowLeft />
                  </button>

                  <div className="carousel-inner d-flex">
                    {allProducts
                      .slice(
                        visibleIndices[category.categoryId],
                        visibleIndices[category.categoryId] + cardsPerView
                      )
                      .map((product) => {
                        const subcategory = category.subcategories.find((sub) =>
                          sub.products.includes(product)
                        );
                        return (
                          <ProductCard
                            key={product.productId}
                            product={product}
                            category={category}
                            subcategory={subcategory}
                          />
                        );
                      })}
                  </div>

                  <button
                    className="btn carousel-arrow right-arrows"
                    onClick={() => handleNext(category.categoryId)}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
};

export default LandingPage;
