
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./AssignRole.css"; // Ensure styles match AddAdmin.css
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import the eye icons
import axios from "axios";
import { useState,useEffect } from "react";
import axiosInstance from "../../../axiosInstance";

const AssignRole = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [roles, setRoles] = useState([
    { roleName: "", username: "", password: "", roleUrl: "" },
  ]);
  const [showPassword, setShowPassword] = useState(false); // Single toggle state for now (global for all)

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/products/get/all`
        );
        const allProducts = response.data;
        const selectedProduct = allProducts.find(
          (product) => product.productId === parseInt(productId)
        );

        if (selectedProduct) {
          setProduct(selectedProduct);
        } else {
          Swal.fire("Error", "Product not found", "error");
          navigate("/superadmindashboard");
        }
      } catch (error) {
        console.error("Error loading product details:", error);
        Swal.fire("Error", "Failed to load product details.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, navigate]);

  const handleRoleChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRoles = [...roles];
    updatedRoles[index][name] = value;
    setRoles(updatedRoles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/api/role/savedata/${productId}`,
        roles,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      Swal.fire("Success!", "Roles saved successfully!", "success");
      setRoles([{ roleName: "", username: "", password: "", roleUrl: "" }]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error saving roles.";
      console.error("Error saving roles:", errorMessage);
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Back Button */}
      <button className="back-button back-arrow" onClick={() => navigate(-1)}>
        <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
      </button>

      <h2 className="mb-4 text-center">
        {product
          ? `Assign Roles for Product: ${product.productName}`
          : "Loading..."}
      </h2>
      <div className="row justify-content-center">
        <div className="col col-sm-8 col-md-8 col-lg-6 col-xl-6 col-xxl-6">
          <div className="card">
            <div className="card-body">
              {loading && <p className="text-center">Loading...</p>}
              <form onSubmit={handleSubmit}>
                <h2 className="text-center">Role Details</h2>
                {roles.map((role, index) => (
                  <div key={index} className="mb-3">
                    <label className="form-label">RoleName</label>
                    <input
                      type="text"
                      name="roleName"
                      placeholder="Role Name"
                      value={role.roleName}
                      onChange={(e) => handleRoleChange(index, e)}
                      className="form-control mb-2"
                      required
                    />
                    <label className="form-label">UserName</label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={role.username}
                      onChange={(e) => handleRoleChange(index, e)}
                      className="form-control mb-2"
                      required
                    />
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"} // Toggle password visibility
                        name="password"
                        placeholder="Password"
                        value={role.password}
                        onChange={(e) => handleRoleChange(index, e)}
                        className="form-control mb-2"
                        required
                      />
                      <span
                        className="input-group-text mb-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                      >
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                      </span>
                    </div>
                    <label className="form-label">RoleUrlPath</label>
                    <input
                      type="text"
                      name="roleUrl"
                      placeholder="Role URL"
                      value={role.roleUrl}
                      onChange={(e) => handleRoleChange(index, e)}
                      className="form-control mb-2"
                      required
                    />
                  </div>
                ))}

                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="mt-4 btn submit_button w-auto mb-4"
                  >
                    <span>Create Role</span>
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

export default AssignRole;
