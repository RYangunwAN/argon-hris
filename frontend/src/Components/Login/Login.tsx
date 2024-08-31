import React, { useState } from "react";
import './Login.css';
import { Link, useNavigate } from "react-router-dom";
import medelaLogo from '../Assets/logo-medela-potentia-white.png'
import { FaUser, FaLock } from "react-icons/fa"

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);

                localStorage.setItem('sessionId', data.sessionId);

                console.log("Login Success")
                setSuccessMessage('Login successful!');
                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } else {

                setErrorMessage(data.msg);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="loginContainer">
            <div className="rowWrapper">
                <div className="logoWrapper">
                    <div>
                        <img src={medelaLogo} alt="" />
                    </div>
                </div>
                <div className="wrapper">
                    <form onSubmit={handleSubmit}>
                        <h1>LOGIN</h1>
                        <div className="inputBox">
                            <input type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <FaUser className="icon"></FaUser>
                        </div>
                        <div className="inputBox">
                            <input type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <FaLock className="icon"></FaLock>
                        </div>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        {successMessage && <p className="success">{successMessage}</p>}
                        <button type="submit">Login</button>
                        <div className="register">
                            <Link to="/Register" >Register Here!</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;