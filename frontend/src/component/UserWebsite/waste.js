import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Profiles.css';

function Profiles() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: '',
    profilePic: '',
  });

  const [errors, setErrors] = useState({});
  const [newProfilePic, setNewProfilePic] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedData = {
      name: localStorage.getItem('fullName') || '',
      email: localStorage.getItem('email') || '',
      mobile: localStorage.getItem('mobileNumber') || '',
      role: localStorage.getItem('role') || '',
      profilePic: localStorage.getItem('profileImage') || '',
    };
    setUserData(storedData);
  }, []);

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
    let error = '';
    if (fieldName === 'name' && !value.trim()) {
      error = 'Name cannot be empty.';
    } else if (fieldName === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      error = emailRegex.test(value) ? '' : 'Invalid email format.';
    } else if (fieldName === 'mobile') {
      const mobileRegex = /^[1-9][0-9]{9}$/; // Ensures no leading 0 and exactly 10 digits
      error = mobileRegex.test(value) ? '' : 'Mobile number must be 10 digits and not start with 0.';
    } else if (fieldName === 'oldPassword' && !value) {
      error = 'Old password is required.';
    } else if (fieldName === 'newPassword') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      error = passwordRegex.test(value)
        ? ''
        : 'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one digit, and one special character.';
    } else if (fieldName === 'confirmPassword' && value !== newPassword) {
      error = 'Passwords do not match.';
    }
  
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error }));
  };
  

  const validateProfileFields = () => {
    const newErrors = {};
    if (!userData.name.trim()) newErrors.name = 'Name cannot be empty.';
    if (!userData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!userData.mobile.match(/^[1-9][0-9]{9}$/)) {
      newErrors.mobile = 'Mobile number must be 10 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePic(reader.result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!validateProfileFields()) return;

    localStorage.setItem('fullName', userData.name);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('mobileNumber', userData.mobile);
    localStorage.setItem('role', userData.role);
    if (newProfilePic) {
      localStorage.setItem('profileImage', newProfilePic);
      setUserData({ ...userData, profilePic: newProfilePic });
    }

    Swal.fire({
      icon: 'success',
      title: 'Profile Updated!',
      text: 'Your profile has been updated successfully.',
      timer: 2000,
      showConfirmButton: false,
    });

    setIsEdit(false);
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'oldPassword') setOldPassword(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmNewPassword(value);

    validateField(name, value);
  };

  const handleChangePassword = () => {
    const passwordErrors = {};
    if (!oldPassword) passwordErrors.oldPassword = 'Old password is required.';
    if (newPassword.length < 8) {
      passwordErrors.newPassword = 'New password must be at least 8 characters.';
    }
    if (newPassword !== confirmNewPassword) {
      passwordErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(passwordErrors);
    if (Object.keys(passwordErrors).length > 0) return;

    Swal.fire({
      icon: 'success',
      title: 'Password Changed!',
      text: 'Your password has been changed successfully.',
      timer: 2000,
      showConfirmButton: false,
    });

    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="container Profiles-container px-0">
      <div className="Profiles-sidebar">
        <img
          src={userData.profilePic || 'https://via.placeholder.com/100'}
          alt="Profile"
          className="profiles-pic"
        />
        <button onClick={() => setIsEdit(false)}>Profile</button>
        <button onClick={() => setIsEdit(true)}>Edit Profile</button>
        <button onClick={() => setIsChangePassword(true)}>Change Password</button>
      </div>

      <div className="Profiles-content">
      {!isEdit && !isChangePassword && (
          <>
            <h1>Profile</h1>
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
          </>
        )}

        {isEdit && (
          <div>
            <h1>Edit Profile</h1>
            <div>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className={`inputFields ${errors.name && 'error-field'}`}
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
                className={`inputFields ${errors.email && 'error-field'}`}
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
                className={`inputFields ${errors.mobile && 'error-field'}`}
              />
              {errors.mobile && <div className="error">{errors.mobile}</div>}
            </div>
            <button onClick={handleSubmit}>Save Changes</button>
          </div>
        )}

        {isChangePassword && (
          <div>
            <h1>Change Password</h1>
            <div>
              <input
                type="password"
                name="oldPassword"
                value={oldPassword}
                onChange={handlePasswordInputChange}
                placeholder="Old Password"
                className={`inputFields ${errors.oldPassword && 'error-field'}`}
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
                onChange={handlePasswordInputChange}
                placeholder="New Password"
                className={`inputFields ${errors.newPassword && 'error-field'}`}
              />
              {errors.newPassword && (
                <div className="error">{errors.newPassword}</div>
              )}
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                value={confirmNewPassword}
                onChange={handlePasswordInputChange}
                placeholder="Confirm Password"
                className={`inputFields ${
                  errors.confirmPassword && 'error-field'
                }`}
              />
              {errors.confirmPassword && (
                <div className="error">{errors.confirmPassword}</div>
              )}
            </div>
            <button onClick={handleChangePassword}>Change Password</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profiles;
