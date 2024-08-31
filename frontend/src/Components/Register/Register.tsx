import React, { useState } from "react";
import './Register.css';
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import medelaLogo from '../Assets/logo-medela-potentia-white.png';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, confirmPassword }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                window.location.href = '/login';
            } else {
                setError(data.msg || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Server error');
        }
    };

    return (
        <div className="registerContainer">
            <div className="rowRegisterWrapper">
                <div className="logoRegisterWrapper">
                    <div>
                        <img src={medelaLogo} alt="Logo" />
                    </div>
                </div>
                <div className="wrapper">
                    <form onSubmit={handleRegister}>
                        <h1>REGISTER</h1>
                        {error && <p className="error">{error}</p>}
                        <div className="inputBox">
                            <input 
                                type="text" 
                                placeholder="Name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                            <FaUser className="icon" />
                        </div>
                        <div className="inputBox">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                            <MdEmail className="icon" />
                        </div>
                        <div className="inputBox">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                            <FaLock className="icon" />
                        </div>
                        <div className="inputBox">
                            <input 
                                type="password" 
                                placeholder="Confirm Password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                            />
                            <FaLock className="icon" />
                        </div>
                        <button type="submit">Register</button>
                        <div className="register">
                            <Link to="/login">Login Here!</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
