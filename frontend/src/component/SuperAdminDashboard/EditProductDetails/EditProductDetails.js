import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../../axiosInstance";

const EditProductDetails = () => {
  const { id: productDetaiId } = useParams();
  const navigate = useNavigate();

  // State variables
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    if (!productDetaiId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Product ID is missing or invalid. Please try again.",
      });
      navigate("/SuperAdminDashboard/productlist");
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/productdetails/details/${productDetaiId}`
        );
        const { name, description, features, images } = response.data;

        setName(name);
        setDescription(description);
        setFeatures(features || [""]);
        setImages(images || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch product details.",
        });
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productDetaiId, navigate]);

  const handleFeatureChange = (index, value) => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature, i) =>
        i === index
          ? { ...feature, featureId: feature.featureId, description: value }
          : feature
      )
    );
  };

  const handleImageChange = (e, index) => {
    const updatedImages = [...images];

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updatedImages[index] = {
          ...updatedImages[index],
          imageData: reader.result.split(",")[1],
        };
        setImages(updatedImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const addFeatureField = () => setFeatures([...features, ""]);
  const removeFeatureField = (index) =>
    setFeatures(features.filter((_, i) => i !== index));

  // const handleVideoChange = (e) => {
  //   const newVideos = Array.from(e.target.files);
  //   setVideos((prevVideos) => [...prevVideos, ...newVideos]);
  //   setVideoDescriptions((prevDescriptions) => [
  //     ...prevDescriptions,
  //     ...newVideos.map(() => ""), // Add empty descriptions for the new videos
  //   ]);
  // };

  const handleVideoChange = (e, index) => {
    const updatedVideos = [...images]; // Copy the existing images array
  
    const file = e.target.files[0]; // Get the first file selected
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Only update if the video is new or changed
        if (updatedVideos[index].videoData !== reader.result.split(",")[1]) {
          updatedVideos[index] = {
            ...updatedVideos[index], // Retain other properties
            videoData: reader.result.split(",")[1], // Update video data
          };
          setImages(updatedVideos); // Set the updated array
        }
      };
      reader.readAsDataURL(file); // Read the video as base64
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productDetaiId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Product ID is missing. Cannot submit the form.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    formData.append("features", JSON.stringify(features));

    formData.append("images", JSON.stringify(images));
    console.log(JSON.stringify(images) + "images data");

    console.log(formData);

    try {
      await axiosInstance.put(
        `${process.env.REACT_APP_API_URL}/api/productdetails/${productDetaiId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product details updated successfully!",
        confirmButtonText: "Okay",
        showConfirmButton: false, // Hides the OK button
        timer: 1000,
      }).then(() => {
        navigate("/SuperAdminDashboard/productlist");
      });
    } catch (error) {
      console.error("Error updating product details:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update product details.",
        confirmButtonText: "Try Again",
        showConfirmButton: false, // Hides the OK button
        timer: 1000,
      });
    }
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


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col col-lg-8">
          <div className="card">
            <div
              className="card-body"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              <form onSubmit={handleSubmit} className="p-3 mb-5">
                <h2 className="text-center mb-4">Edit Product Details</h2>

                {/* Name */}
                <div className="mb-3">
                  <label className="form-label">Name:</label>
                  <textarea
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  ></textarea>
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
                      {/* <h1>{feature.featureId}</h1> */}
                      <input
                        type="text"
                        className="form-control me-2"
                        value={feature.description}
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

                <div className="mb-3">
                  <label className="form-label">Images:</label>
                  {images
                    .filter((image) => image.imageData !== null) // Only include images with imageData
                    .map((image, index) => (
                      <div
                        key={index}
                        className="mb-2 d-flex align-items-center"
                      >
                        <h3 className="fw-light mx-3">{image.imageId} </h3>
                        <img
                          src={`data:image/jpeg;base64,${image.imageData}`}
                          alt={`Image ${index + 1}`}
                          style={{
                            width: "100px",
                            height: "auto",
                            marginRight: "10px",
                          }}
                        />
                        <input
                          type="text"
                          className="form-control me-2"
                          placeholder={`Description for Image ${index + 1}`}
                          value={image.imageDescription || ""}
                          onChange={(e) => {
                            const updatedImages = [...images];
                            updatedImages[index] = {
                              ...image,
                              imageDescription: e.target.value,
                            };
                            setImages(updatedImages);
                          }}
                        />
                        <input
                          type="file"
                          className="form-control mt-2"
                          multiple
                          onChange={(e) => handleImageChange(e, index)}
                          ref={imageInputRef}
                        />
                      </div>
                    ))}
                </div>

                <div className="mb-3">
                  <label className="form-label">Videos:</label>
                  {images
                    .filter((video) => video.videoData !== null) // Only show videos with data
                    .map((video, index) => (
                      <div
                        key={index}
                        className="mb-2 d-flex align-items-center"
                      >
                      <h3 className="fw-light mx-3">{video.imageId} </h3>
                        <video
                          controls
                          style={{
                            width: "100px",
                            height: "auto",
                            marginRight: "10px",
                          }}
                        >
                          <source
                            src={`data:video/mp4;base64,${video.videoData}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>

                        <input
                          type="text"
                          className="form-control me-2"
                          placeholder={`Description for Video ${index + 1}`}
                          value={video.videoDescription || ""}
                          onChange={(e) => {
                            const updatedVideos = [...images];
                            updatedVideos[index] = {
                              ...video,
                              videoDescription: e.target.value, // Update video description
                            };
                            setImages(updatedVideos); // Update state
                          }}
                        />

                        <input
                          type="file"
                          className="form-control mt-2"
                          onChange={(e) => handleVideoChange(e, index)} // Pass index for identification
                          ref={videoInputRef}
                        />
                      </div>
                    ))}
                </div>

                <div className="d-flex justify-content-center">
                <button
                    type="submit"
                    className="btn submit_button mt-4 w-auto mb-4"
                  >
                    <span>Save Changes</span>
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

export default EditProductDetails;