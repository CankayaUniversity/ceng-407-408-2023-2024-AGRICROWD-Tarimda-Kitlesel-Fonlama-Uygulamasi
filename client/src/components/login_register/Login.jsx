import { React, useState } from "react";
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()
    const [recaptchaValue, setRecaptchaValue] = useState(null);

    const handleRecaptchaChange = (value) => {
        setRecaptchaValue(value);
    };
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!recaptchaValue) {
            console.log("reCAPTCHA validation failed");
            return;
        } else {
            axios.post('http://localhost:3001/login', { email, password, recaptchaValue })
                .then(result => {
                    console.log(result)
                    if (result.data === "Successful") {
                        navigate('/user-panel')
                    }
                })
                .catch(err => console.log(err))
        }
    }
    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>LOGIN</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input type="email" name="email" placeholder="Enter Email" autoComplete="off" className="form-control rounded-0" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Password</strong>
                        </label>
                        <input type="password" placeholder="Enter Password" name="password" className="form-control rounded-0" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <ReCAPTCHA
                            sitekey="6LdYdJIpAAAAACdHw2Hipmtpk0U7nzv0hhtIHXmb"
                            onChange={handleRecaptchaChange}
                        />
                    </div>
                    <button type="submit" className="btn w-100 rounded-0">
                        Login
                    </button>
                </form>
                <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Sign up
                </Link>
            </div>
        </div>
    );
}

export default Login;