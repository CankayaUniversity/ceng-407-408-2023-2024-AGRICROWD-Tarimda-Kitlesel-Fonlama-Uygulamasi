import { React, useState, useRef, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from 'js-cookie';
axios.defaults.withCredentials = true;

function AdminLogin() {

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [errorMessage, setErrorMessage] = useState("");
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const recaptchaRef = useRef();
    const navigate = useNavigate()

    const handleRecaptchaChange = (value) => {
        setRecaptchaValue(value);
    };
    const resetRecaptcha = () => {
        recaptchaRef.current.reset();
        setRecaptchaValue(null);
    };

    useEffect(() => {
        const admToken = Cookies.get('admToken');
        if (admToken) {
            axios.post('http://localhost:3001/api/admin/verify-token', { token: admToken })
                .then(response => {
                    if (response.data.success) {
                        navigate(`/admin/panel`);
                    } else {
                        console.log("Token doğrulanamadı.");
                    }
                })
                .catch(err => {
                    console.error("Token doğrulama hatası:", err);
                });
        }
    }, []); 

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!recaptchaValue) {
            console.log("reCAPTCHA validation failed");
            return;
        } else {
            console.log("reCAPTCHA validation success");
            axios.post('http://localhost:3001/api/admin/login', { username, password, recaptchaValue }, { withCredentials: true })
                .then(response => {
                    console.log("Server response is: ", response);
                    if (response.status) {
                        window.alert("Basariyla giris yaptiniz!");
                        Cookies.set('admToken', response.data.authToken, { expires: 1 / 24 });
                        setTimeout(() => {
                            navigate(`/admin/panel`);
                            window.location.reload();
                        }, 250);
                    } else {
                        window.alert("Server hatasi!");
                        resetRecaptcha();
                    }
                })
                .catch(err => {
                    resetRecaptcha();
                    if (err.response && err.response.data && err.response.data.errors) {
                        setErrorMessage(err.response.data.errors[0]);
                    } else {
                        setErrorMessage("Bilinmeyen bir hata oluştu.");
                    }
                });
        }
    }
    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username">
                            <strong>Username</strong>
                        </label>
                        <input type="text" name="username" placeholder="Enter Your Username" autoComplete="off" className="form-control rounded-0" onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input type="password" placeholder="Enter Password" name="password" className="form-control rounded-0" onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6LdYdJIpAAAAACdHw2Hipmtpk0U7nzv0hhtIHXmb"
                            onChange={handleRecaptchaChange}
                        />
                    </div>
                    <button type="submit" className="btn w-100 rounded-0">
                        Admin Login
                    </button>
                </form>
                {errorMessage && <div className="error-message">{errorMessage}</div>}

            </div>
        </div>
    );
}

export default AdminLogin; 