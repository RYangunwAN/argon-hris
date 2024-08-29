import React from "react";
import './Login.css';
import medelaLogo from '../Assets/logo-medela-potentia-white.png'
import { FaUser, FaLock } from "react-icons/fa"

const Login = () => {
    return (
        <div className="rowWrapper">
            <div className="logoWrapper">
                <div>
                    <img src={medelaLogo} alt="" />
                </div>
            </div>
            <div className="wrapper">
                <form action="">
                    <h1>LOGIN</h1>

                    <div className="inputBox">
                        <input type="text" placeholder="Username" required />
                        <FaUser className="icon"></FaUser>
                    </div>

                    <div className="inputBox">
                        <input type="password" placeholder="Password" required />
                        <FaLock className="icon"></FaLock>
                    </div>

                    <button type="submit">Login</button>

                    <div className="register">
                        <a href="#">Register Here!</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;