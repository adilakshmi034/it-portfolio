import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddProductDetails.css";
import axiosInstance from "../../../axiosInstance";

const AddProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([""]);
  const [images, setImages] = useState([]);
  const [image, setImage] = useState(null);
  const [imageDescriptions, setImageDescriptions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoDescriptions, setVideoDescriptions] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Fetch product name when the component mounts
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // Fetch product name
        const productResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/getby/${productId}`
        );
        setName(productResponse.data.productName);
      } catch (error) {
        console.error("Error fetching product name:", error);
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: "Failed to fetch product details.",
          confirmButtonText: "Retry",
        });
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  // Handle change for feature fields
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  // Add and remove feature fields
  const addFeatureField = () => setFeatures([...features, ""]);
  const removeFeatureField = (index) =>
    setFeatures(features.filter((_, i) => i !== index));

  // Handle image and video file selections
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const errors = [];
    const validImages = [];

    files.forEach((file) => {
      const fileSizeMB = file.size / 1024 / 1024;
      const fileType = file.type;

      if (fileSizeMB > 2) {
        errors.push(`The file "${file.name}" exceeds the 2MB size limit.`);
        setImage(null);
        return;
      } else if (fileType !== "image/jpeg" && fileType !== "image/png") {
        errors.push(
          `The file "${file.name}" is not a valid image format (JPEG/PNG only).`
        );
      } else {
        validImages.push(file);
      }
    });

    setImages(validImages);
    setImageDescriptions(Array(validImages.length).fill(""));
    setImageErrors(errors);
  };

  const handleVideoChange = (e) => {
    setVideos([...e.target.files]);
    setVideoDescriptions(Array(e.target.files.length).fill(""));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    // Append features as individual entries
    features.forEach((feature) => formData.append("features", feature));

    // Append images and descriptions if available
    images.forEach((image) => formData.append("images", image));
    imageDescriptions.forEach((desc, index) => {
      if (desc) formData.append("imageDescriptions", desc);
    });

    // Append videos and descriptions if available
    videos.forEach((video) => formData.append("videos", video));
    videoDescriptions.forEach((desc, index) => {
      if (desc) formData.append("videoDescriptions", desc);
    });

    try {
      const resp = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/api/productdetails/${productId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product details created successfully!",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        navigate("/SuperAdminDashboard/productlist");
      });

      // Reset form after successful submission
      setName("");
      setDescription("");
      setFeatures([""]);
      setImages([]);
      setImageDescriptions([]);
      setVideos([]);
      setVideoDescriptions([]);

      // Clear file input fields
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (videoInputRef.current) videoInputRef.current.value = "";
    } catch (error) {
      console.error("Error creating product details:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: "Failed to create product details.",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="container">
      {/* Back Arrow Button */}
      <button
        variant="link"
        className="mb-3 back-button back-arrow"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>
      <div className="row justify-content-center">
        <div className="col col-sm-12 col-md-10 col-lg-8 col-xl-8 col-xxl-8">
          <div className="card">
            <div
              className="card-body"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              <form onSubmit={handleSubmit} className="p-3 mb-5">
                <h2 className="text-center mb-4">Create Product Details</h2>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description:</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                {/* Features */}
                <div className="mb-3">
                  <label className="form-label">Features:</label>
                  {features.map((feature, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <input
                        type="text"
                        className="form-control me-2"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeFeatureField(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary mt-2"
                    onClick={addFeatureField}
                  >
                    Add Feature
                  </button>
                </div>

                {/* Images */}
                <div className="mb-3">
                  <label className="form-label">Images:</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={handleImageChange}
                    ref={imageInputRef}
                  />
                  {imageErrors.length > 0 && (
                    <div className="text-danger mt-2">
                      {imageErrors.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Image Descriptions */}
                <div className="mb-3">
                  <label className="form-label">Image Descriptions:</label>
                  {images.map((image, index) => (
                    <div key={index}>
                      <textarea
                        className="form-control mb-2"
                        placeholder={`Description for Image ${index + 1}`}
                        value={imageDescriptions[index] || ""}
                        onChange={(e) => {
                          const updatedDescriptions = [...imageDescriptions];
                          updatedDescriptions[index] = e.target.value;
                          setImageDescriptions(updatedDescriptions);
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Videos */}
                <div className="mb-3">
                  <label className="form-label">Videos:</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={handleVideoChange}
                    ref={videoInputRef}
                  />
                </div>

                {/* Video Descriptions */}
                <div className="mb-3">
                  <label className="form-label">Video Descriptions:</label>
                  {videos.map((_, index) => (
                    <div key={index}>
                      <textarea
                        className="form-control mb-2"
                        placeholder={`Description for Video ${index + 1}`}
                        value={videoDescriptions[index] || ""}
                        onChange={(e) => {
                          const updatedDescriptions = [...videoDescriptions];
                          updatedDescriptions[index] = e.target.value;
                          setVideoDescriptions(updatedDescriptions);
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="mt-4 btn submit_button w-auto mb-4"
                  >
                    <span>Create Product Details</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductDetails;
