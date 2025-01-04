import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./Profiles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../axiosInstance";

function Profiles() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    profilePic: localStorage.getItem("profileImage") || "",
  });

  const [newProfilePic, setNewProfilePic] = useState(""); // Temporary state for the new profile picture
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(""); // State for image upload error
  const userId = localStorage.getItem("clients_Id");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setMessage("User ID found. Please log in again.");
        return;
      }
  
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/profile/get/${userId}`
        );
  
        if (response.status === 200) {
          // Accessing the correct path in the response object
          console.log(response.data.client.fullName); // Should log "saaaaa"
  
          setUserData({
            name: response.data.client.fullName || "", // Corrected path
            email: response.data.client.email || "",  // Corrected path
            mobile: String(response.data.client.mobileNumber || ""), // Corrected path and type conversion
            role: response.data.client.role || "",    // Corrected path
            profilePic: response.data.client.profilePicture
              ? `data:image/jpeg;base64,${response.data.client.profilePicture}`
              : "https://via.placeholder.com/100", // Default to placeholder if no profile picture
          });
        }
      } catch (error) {
        setError("Error fetching profile data. Please try again later.");
      }
    };
  
    fetchUserProfile();
  }, [userId]);
  
  // Function to get the appropriate user ID based on role
  // Handle image file selection or drag-and-drop
  const handleImageUpload = (event) => {
    setLoading(true);
    setImageError("");

    const file = event.target.files[0];

    // Check if a file is selected
    if (file) {
      // Validate file size (less than 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError("File size must be less than 2MB.");
        setNewProfilePic(null);
        setLoading(false); // Hide loading spinner
        return;
      }

      // Validate file type (JPEG, PNG)
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setImageError("Only JPEG and PNG formats are allowed.");
        setNewProfilePic(null);
        setLoading(false); // Hide loading spinner
        return;
      }

      // Clear any previous errors if validation passes
      setImageError("");

      // Load the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePic(reader.result); // Set the image preview
        setLoading(false); // Hide loading spinner after loading the image
      };
      reader.readAsDataURL(file);
    } else {
      setLoading(false); // Hide loading spinner if no file is selected
    }
  };
  // Handle drag over (for drag and drop)
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setImageError(""); // Clear previous image errors

    const file = e.dataTransfer.files[0];
    if (file) {
      // Validate file size (less than 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError("File size must be less than 2MB.");
        setLoading(false); // Hide loading spinner
        return;
      }

      // Validate file type (JPEG, PNG)
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setImageError("Only JPEG and PNG formats are allowed.");
        setLoading(false); // Hide loading spinner
        return;
      }

      // Clear any previous errors if validation passes
      setImageError("");

      // Load the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePic(reader.result); // Temporarily store the selected image
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    validateField(name, value);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const validateField = (fieldName, value) => {
    let error = "";
    if (fieldName === "name" && !value.trim()) {
      error = "Name cannot be empty.";
    } else if (fieldName === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      error = emailRegex.test(value) ? "" : "Invalid email format.";
    } else if (fieldName === "mobile") {
      if (value.startsWith("0") && value.length !== 10) {
        error =
          "Mobile number cannot start with 0 and must be exactly 10 digits.";
      } else if (value.startsWith("0")) {
        error = "Mobile number cannot start with 0.";
      } else if (value.length !== 10) {
        error = "Mobile number must be exactly 10 digits.";
      } else {
        const mobileRegex = /^[1-9][0-9]{9}$/;
        error = mobileRegex.test(value) ? "" : "Invalid mobile number format.";
      }
    } else if (fieldName === "oldPassword" && !value) {
      error = "Old password is required.";
    } else if (fieldName === "newPassword") {
      const passwordStrength = evaluatePasswordStrength(value);
      if (passwordStrength !== "strong") {
        error = `${passwordStrength}`;
      } else {
        error = "";
      }
    } else if (fieldName === "confirmPassword" && value !== newPassword) {
      error = "Passwords do not match.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
  };

  // Step 2: Create the password strength evaluator function
  const evaluatePasswordStrength = (password) => {
    const length = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    if (length && hasUppercase && hasLowercase && hasDigit && hasSpecialChar) {
      return "strong";
    } else if (
      length &&
      (hasUppercase || hasLowercase) &&
      (hasDigit || hasSpecialChar)
    ) {
      return "medium";
    } else if (length) {
      return "weak";
    }
    return "too short";
  };

  // Step 3: Update the UI with password strength feedback
  const getPasswordStrengthClass = (strength) => {
    switch (strength) {
      case "strong":
        return "strength-strong";
      case "medium":
        return "strength-medium";
      case "weak":
        return "strength-weak";
      default:
        return "strength-none";
    }
  };

  const validateProfileFields = () => {
    const newErrors = {};
    if (!userData.name.trim()) newErrors.name = "Name cannot be empty.";
    if (!userData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format.";
    }
    if (!userData.mobile.match(/^[1-9][0-9]{9}$/)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateProfileFields()) return;

    if (!userId) {
      setMessage("User ID not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", userData.name);
    formData.append("email", userData.email);
    formData.append("mobileNumber", userData.mobile);

    // If there is a new profile image, append it as well
    if (newProfilePic) {
      const file = dataURItoBlob(newProfilePic); // Convert base64 to Blob for the file
      formData.append("file", file);
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/profile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // Save to localStorage after the request is successful
        localStorage.setItem("fullName", userData.name);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("mobileNumber", userData.mobile);
        localStorage.setItem("role", userData.role);
        // Save updated profile picture in localStorage (only raw base64 part)
        if (newProfilePic) {
          // Extract base64 data without the prefix (data:image/jpeg;base64,)
          const base64Data = newProfilePic.split(",")[1];
          localStorage.setItem("profileImage", base64Data); // Save only base64 data
          setUserData({ ...userData, profilePic: newProfilePic }); // Update user data with new profile image
        }
        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your profile has been updated successfully.",
          timer: 1000, // Auto-close after 1 second
          showConfirmButton: false,
        });
        setIsEdit(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again.",
        showConfirmButton: false,
        timer: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Utility function to convert base64 to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" }); // Change type if necessary based on the image format
  };
  const handleDeleteProfilePic = async () => {

    if (!userId) {
      setMessage("User ID  not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.delete(
        `${process.env.REACT_APP_API_URL}/api/profile/delete/${userId}`
      );

      if (response.status === 200) {
        // Remove profile picture from state and localStorage
        setUserData({ ...userData, profilePic: "" });
        localStorage.removeItem("profileImage");

        Swal.fire({
          icon: "success",
          title: "Profile Picture Deleted",
          text: "Your profile picture has been removed successfully.",
          timer: 1000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: "Could not delete the profile picture. Please try again.",
          timer: 1000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Unable to delete the profile picture.",
        timer: 1000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const passwordErrors = {};
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError("All fields are required.");
      return;
    }

    if (!userId) {
      setMessage("User ID not found. Please log in again.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_API_URL}/api/clients/changepassword/${userId}`,
        null, // No body needed for form-data or URL params
        {
          params: {
            oldPassword,
            newPassword,
            confirmPassword: confirmNewPassword,
          },
        }
      );

      if (response.status === 200) {
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        Swal.fire({
          icon: "success",
          title: "Password Changed!",
          text: "Your password has been changed successfully.",
          timer: 1000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Something went happend!!",
          text: "Please try again.",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } catch (error) {
      setMessage("Something went happened!!. Please try again.");
    }
  };

  return (
    <div className="container Profiles-container px-0">
      <div className="Profiles-sidebar">
        <div className="profile-pic-container">
          {/* Always show the icon if there is no profile image */}
          {!userData.profilePic && !localStorage.getItem("profileImage") ? (
            <FontAwesomeIcon
              icon={faUserCircle}
              className="profile-icon text-muted"
              style={{ width: "150px", height: "150px" }}
            />
          ) : (
            <img
              src={userData.profilePic || localStorage.getItem("profileImage")}
              alt="Profile"
              className="profiles-pic"
            />
          )}
        </div>

        {localStorage.getItem("profileImage") && (
          <button onClick={handleDeleteProfilePic}>Delete Profile Image</button>
        )}
        <button
          className={!isEdit && !isChangePassword ? "active" : ""}
          onClick={() => {
            setIsEdit(false);
            setIsChangePassword(false);
          }}
        >
          Profile
        </button>
        <button
          className={isEdit ? "active" : ""}
          onClick={() => {
            setIsEdit(true);
            setIsChangePassword(false);
          }}
        >
          Edit Profile
        </button>
        <button
          className={isChangePassword ? "active" : ""}
          onClick={() => {
            setIsChangePassword(true);
            setIsEdit(false);
          }}
        >
          Change Password
        </button>
      </div>

      <div className="Profiles-content">
        {/* Profile View */}
        {!isEdit && !isChangePassword && (
          <>
            <h1>Profile</h1>
            <div className="form-group form-groups mt-5">
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Name"
                readOnly={isReadOnly}
                className="inputFields"
              />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Email"
                readOnly={isReadOnly}
                className="inputFields"
              />
              <input
                type="text"
                name="mobile"
                value={userData.mobile}
                onChange={handleChange}
                placeholder="Mobile"
                readOnly={isReadOnly}
                className="inputFields"
              />
              <input
                type="text"
                name="role"
                value={userData.role}
                onChange={handleChange}
                placeholder="Role"
                readOnly={isReadOnly}
                className="inputFields"
              />
            </div>
          </>
        )}

        {/* Edit Profile */}
        {isEdit && (
          <div>
            <h1>Edit Profile</h1>
            <div className="form-group form-groups mt-5">
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className={`inputFields ${errors.name && "error-field"}`}
              />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className={`inputFields ${errors.email && "error-field"}`}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div>
              <input
                type="text"
                name="mobile"
                value={userData.mobile}
                onChange={handleInputChange}
                placeholder="Mobile"
                className={`inputFields ${errors.mobile && "error-field"}`}
              />
              {errors.mobile && <div className="error">{errors.mobile}</div>}
            </div>
            {/* <input
              type="text"
              name="role"
              value={userData.role}
              onChange={handleChange}
              placeholder="Role"
              className="inputFields"
            /> */}

            {/* Image Upload Section with Drag-and-Drop */}
            {/* Image Upload Section with Drag-and-Drop */}
            <div
              className="image-upload-area"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <label htmlFor="file-input" className="upload-label">
                Drag and drop an image here or{" "}
                <span className="click-text">click to select</span>
              </label>
              <input
                type="file"
                id="file-input"
                onChange={handleImageUpload}
                className="image-input"
              />
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                newProfilePic && (
                  <img
                    src={newProfilePic}
                    alt="Profile"
                    className="profile-pic-preview"
                  />
                )
              )}
              {/* Display image validation error */}
              {imageError && <div className="error">{imageError}</div>}
            </div>

            <button className="mt-3 submit-button" onClick={handleSubmit}>
              <span>Save Changes</span>
            </button>
          </div>
        )}

        {/* Change Password */}
        {isChangePassword && (
          <div>
            <h1>Change Password</h1>
            <div className="form-group form-groups mt-5">
              {/* <label className="Labeling">Old Password</label> */}
              <input
                type="password"
                placeholder="Enter Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={`inputFields ${errors.oldPassword && "error-field"}`}
              />
              {errors.oldPassword && (
                <div className="error">{errors.oldPassword}</div>
              )}
            </div>
            <div>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validateField("newPassword", e.target.value); // Trigger validation on change
                }}
                placeholder="New Password"
                className={`inputFields ${errors.newPassword && "error-field"}`}
              />
              {errors.newPassword && (
                <div className="error">{errors.newPassword}</div>
              )}

              {/* Display password strength */}
              {newPassword && (
                <div
                  className={` ${getPasswordStrengthClass(errors.newPassword)}`}
                >
                  {/* Password Strength:{" "}
                  {errors.newPassword ? errors.newPassword : "Strong"} */}
                </div>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  validateField("confirmPassword", e.target.value); // Trigger validation on change
                }}
                placeholder="Confirm New Password"
                className={`inputFields ${
                  errors.confirmPassword && "error-field"
                }`}
              />
              {errors.confirmPassword && (
                <div className="error">{errors.confirmPassword}</div>
              )}
            </div>
            {error && <div className="error">{error}</div>}
            {message && <div className="success">{message}</div>}
            <button className="submit-button" onClick={handleChangePassword}>
              <span>Change Password</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profiles;
