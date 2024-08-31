import React from "react";
import './Register.css';
import { FaUser, FaLock } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { Link } from "react-router-dom";
import medelaLogo from '../Assets/logo-medela-potentia-white.png'


const Register = () => {
    return (
        <div className="registerContainer">
            <div className="rowRegisterWrapper">
                <div className="logoRegisterWrapper">
                    <div>
                        <img src={medelaLogo} alt="" />
                    </div>
                </div>
                <div className="wrapper">
                    <form action="">
                        <h1>REGISTER</h1>
                        <div className="inputBox">
                            <input type="text" placeholder="Name" required />
                            <FaUser className="icon"></FaUser>
                        </div>
                        <div className="inputBox">
                            <input type="password" placeholder="Email" required />
                            <MdEmail className="icon"></MdEmail>
                        </div>
                        <div className="inputBox">
                            <input type="password" placeholder="Password" required />
                            <FaLock className="icon"></FaLock>
                        </div>
                        <div className="inputBox">
                            <input type="password" placeholder="Confirm Password" required />
                            <FaLock className="icon"></FaLock>
                        </div>
                        <button type="submit">Register</button>
                        <div className="register">
                            <Link to="/Login">Login Here!</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;