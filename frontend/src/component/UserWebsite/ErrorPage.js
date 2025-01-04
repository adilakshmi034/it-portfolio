import React from "react";
import ErrorIllustration from "../../assets/6342468.jpg"; // 404 image

const ErrorPage = () => {
  return (
    <div className="error-container text-center">
      <img
        src={ErrorIllustration} // Replace with actual path to your 404 error illustration
        alt="404 Error"
        className="img-fluid"
        style={{ maxWidth: "300px" }}
      />
      <p>Oops! This page doesn't exist.</p>
    </div>
  );
};

export default ErrorPage;
