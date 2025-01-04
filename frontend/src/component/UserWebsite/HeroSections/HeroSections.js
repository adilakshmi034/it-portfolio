import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HeroSections.css";

const HeroSections = ({ categories }) => {
  const sliderRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products directly from the categories prop
    const allProducts = categories.flatMap((category) =>
      category.subcategories.flatMap((subcategory) => subcategory.products)
    );
    setProducts(allProducts); // Set the products data
  }, [categories]);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -100, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 100, behavior: "smooth" });
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => {
    return (
      <div className="product-card skeleton-card">
        <div className="skeleton-title"></div>
        <div className="skeleton-description"></div>
        <div className="skeleton-price"></div>
        <div className="skeleton-image"></div>
      </div>
    );
  };

  return (
    <div className="hero-section mb-5">
      <div className="hero-content">
        <h1>
          Pay once, <span>not monthly.</span>
        </h1>
        <p>
          Sick of subscriptions? Get quality business software with no monthly
          fees.
        </p>
      </div>

      <div className="slider-container container-fluid">
        <div className="text-and-slider">
          <div className="product-slider" ref={sliderRef}>
            {/* Show skeleton loaders while data is being fetched */}
            {products.length === 0
              ? Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonLoader key={index} />
                ))
              : products.map((product, index) => {
                  // Find category and subcategory for the product
                  const category = categories.find((cat) =>
                    cat.subcategories.some((sub) => sub.products.includes(product))
                  );
                  const subcategory = category?.subcategories.find((sub) =>
                    sub.products.includes(product)
                  );

                  // Get the categoryName and subCategoryName for the Link state
                  const categoryName = category ? category.name : "";
                  const subCategoryName = subcategory ? subcategory.name : "";

                  return (
                    <Link
                      to={`/ProductDetails/${product.productId}`}
                      key={index}
                      state={{ categoryName, subCategoryName }} // Passing category and subcategory
                      className="product-card"
                      style={{ textDecoration: "none" }}
                    >
                      <p className="product-description">
                        {product.productDescription}
                      </p>
                      <h2 className="product-title">{product.productName}</h2>
                      <p className="product-price">
                        ${product.offerPrice}{" "}
                        <span className="original-price">${product.price}</span>
                      </p>
                      <img
                        src={`data:image/png;base64,${product.image}`}
                        alt={product.productName}
                        className="product-image"
                      />
                    </Link>
                  );
                })}
          </div>
        </div>
        <div className="arrow-controls d-flex">
          <button className="arrow-buttons" onClick={scrollLeft}>
            ←
          </button>
          <button className="arrow-buttons" onClick={scrollRight}>
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSections;
