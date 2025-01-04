import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Table, Button, Row, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import "./ViewProductDetails.css";
import axiosInstance from "../../../axiosInstance";

const ViewProductDetails = () => {
  const { id } = useParams(); // Get the product id from the URL
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/productdetails/get/${id}`
        );
        setProductDetails(response.data); // Set the product details state
      } catch (err) {
        setError(err);
        if (err.response?.status === 404) {
          Swal.fire({
            icon: "error",
            title: "Product Not Found",
            text: "The product you are looking for does not exist.",
            confirmButtonText: "Go Back",
          }).then(() => {
            navigate("/superadmindashboard/productlist"); // Redirect to product list
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Something went happened",
            text: "Failed to load product details.",
            confirmButtonText: "Try Again",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Handle deletion
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00d5cd",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(
            `${process.env.REACT_APP_API_URL}/api/productdetails/delete/${id}`
          );
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The product has been deleted.",
            showConfirmButton: false, // Hides the OK button
            timer: 1000, // Automatically closes after 1.5 seconds
          });
          navigate("/superadmindashboard/productlist"); // Navigate back to the product list
        } catch (error) {
          Swal.fire({
            title:"Something went happened!",
            text:"There was a problem deleting the product.",
            icon:"error",
            showConfirmButton: false, // Hides the OK button
            timer: 1000,
        });
        }
      }
    });
  };

  // Handle navigation actions for editing
  const handleEdit = (productDetaiId) => {
    navigate(`/superadmindashboard/EditProductDetails/${productDetaiId}`);
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



  // Combine all feature descriptions pointwise
  const featureDescriptions = productDetails.features
    ?.map((feature) => `• ${feature.description}`)
    .join("\n");

  // Combine all image/video descriptions
  const imageDescriptions = productDetails.images?.map((image, idx) => {
    return (
      <div key={idx}>
        {image.imageDescription && (
          <div>
            <strong>Image Description: </strong>
            {image.imageDescription}
          </div>
        )}
        {image.videoDescription && (
          <div>
            <strong>Video Description: </strong>
            {image.videoDescription}
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="container table-con mt-5">
      {/* Back Arrow Button */}
      <button
        variant="link"
        className="mb-3 back-button back-arrow"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>

      <div className="table-responsive">
        <Table striped bordered hover className="table-layout">
          <thead>
            <tr>
              <th className="scrollable-column">Product Name</th>
              <th className="scrollable-column">Product Description</th>
              <th className="scrollable-column">Product Images</th>
              <th className="scrollable-column">Product Video</th>
              <th className="scrollable-column">Feature Descriptions</th>
              <th className="scrollable-column">Image/Video Descriptions</th>
              <th className="scrollable-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="scrollable-column">{productDetails.name}</td>
              <td className="scrollable-column">{productDetails.description}</td>
              <td className="scrollable-column">
                {productDetails.images && productDetails.images.length > 0 ? (
                  <Row>
                    {productDetails.images.map((image, idx) => {
                      if (image.imageData) {
                        return (
                          <div key={idx} className="mb-3">
                            <img
                              src={`data:image/jpeg;base64,${image.imageData}`}
                              alt={`Product Image ${idx + 1}`}
                              className="img-fluid"
                              style={{
                                maxHeight: "200px",
                                objectFit: "cover",
                                width: "100%",
                              }}
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
                  </Row>
                ) : (
                  <div>No Images Available</div>
                )}
              </td>
              <td className="scrollable-column">
                {productDetails.images?.some((video) => video.videoData) ? (
                  <Row>
                    {productDetails.images?.map((video, idx) => {
                      if (video.videoData) {
                        return (
                          <div key={idx} className="mb-3">
                            <video
                              className="img-fluid"
                              controls
                              width="100%"
                            >
                              <source
                                src={`data:video/mp4;base64,${video.videoData}`}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </Row>
                ) : (
                  <div>No Videos Available</div>
                )}
              </td>
              <td className="scrollable-column">
                <pre>{featureDescriptions}</pre>
              </td>
              <td className="scrollable-column">{imageDescriptions}</td>
              <td className="Admin_Actions text-center">
                <Button
                  className="action-buttons edit"
                  onClick={() => handleEdit(productDetails.productDetaiId)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <Button
                  className="action-buttons delete"
                  onClick={() => handleDelete(productDetails.productDetaiId)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ViewProductDetails;
