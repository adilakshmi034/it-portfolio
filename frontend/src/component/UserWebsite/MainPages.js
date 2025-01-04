import React, { useState, useEffect } from "react";
import UserHeader from "./UserHeader/UserHeader";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";
import ErrorIllustration from "../../assets/6342468.jpg";

const MainPages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null); // Error state to track errors

  // Simulate loading state or fetch data
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // Loading State
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

  return (
    <>
      {pageError ? (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
          <img
            src={ErrorIllustration} // Use your 404 illustration
            alt="404 Error"
            className="img-fluid"
            style={{ maxWidth: "700px" }} // Optional: adjust the image size
          />
          <h3>Oops! Something went wrong.</h3>
          {/* <p>{pageError}</p> */}
        </div>
      ) : (
        <>
          <UserHeader
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
            activeCategory={searchQuery ? "SearchResults" : ""}
          />
          <main>
            <Outlet context={{ setPageError }} />{" "}
            {/* Pass error setter as context */}
          </main>
          <Footer />
        </>
      )}
    </>
  );
};

export default MainPages;
