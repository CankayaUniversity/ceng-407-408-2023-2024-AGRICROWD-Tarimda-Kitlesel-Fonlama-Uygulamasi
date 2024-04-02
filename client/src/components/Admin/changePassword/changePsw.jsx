import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      setErrorMessage("Yeni şifreniz doğrulama şifrenizle eşleşmiyor.");
      return;
    }

    if (oldPassword === newPassword) {
      setErrorMessage("Eski şifreniz yeni şifrenizle aynı olamaz.");
      return;
    }

    try {
      const token = Cookies.get("admToken"); 
      const response = await axios.put('http://localhost:3001/api/admin/change-password', {
        oldPassword,
        newPassword,
        token
      });
      if (response.data.success) {
        setSuccessMessage("Şifrenizi başarıyla değiştirdiniz!"); // Başarı mesajını ayarla
        setErrorMessage(""); // Hata mesajını temizle
      }
      console.log("Server response: ", response.data);
    } catch (error) {
      console.error("Change password error: ", error);
      setErrorMessage("Şifre değiştirme işlemi başarısız oldu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Şifre Değiştirme</h2>
        {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>} {/* Yeni başarı mesajını görüntüle */}
        <div className="mb-3">
          <label htmlFor="oldPassword" className="form-label">Eski Şifre</label>
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
          <label htmlFor="newPassword" className="form-label">Yeni Şifre</label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$"
            required
          />
          <div className="form-text">Şifreniz en az bir harf, bir rakam veya özel karakter içermeli ve en az 8 karakterden oluşmalıdır.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Yeni Şifre Tekrar</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleChangePassword}>Şifreyi Değiştir</button>
      </div>
    </div>
  );
}

export default ChangePassword;
