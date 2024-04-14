import React, { useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Your new password and confirmation password do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      setErrorMessage("Your old password cannot be the same as your new password.");
      return;
    }

    try {
      const admToken = Cookies.get("admToken");
      const response = await axios.put('http://localhost:3001/api/admin/change-password', {
        oldPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${admToken}` }
      });
      if (response.data.success) {
        setSuccessMessage("You have successfully changed your password!");
        setErrorMessage("");
      }
      console.log("Server response: ", response.data);
    } catch (error) {
      console.error("Change password error: ", error);
      setErrorMessage("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Change Password</h2>
        {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
        <div className="mb-3">
          <label htmlFor="oldPassword" className="form-label">Old Password</label>
          <input
            type="password"
            className="form-control"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$"
            required
          />
          <div className="form-text">Your password must contain at least one letter, one number, or special character and be at least 8 characters long.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleChangePassword}>Change Password</button>
      </div>
    </div>
  );
}

export default ChangePassword;
