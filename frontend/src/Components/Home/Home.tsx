
import React, { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { MdOutlineLogout } from "react-icons/md";

const Home = () =>{
    const navigate = useNavigate();
    const [userName, setUsername] = useState('');


    useEffect(() => {
        const getUserData = async () => {
            const sessionId = localStorage.getItem('sessionId');

            if (!sessionId) {
                console.error('No sessionId found');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/checkSession?sessionId=${encodeURIComponent(sessionId)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                const data = await response.json();

                if (response.ok) {
                    setUsername(data.name); // Set the username state with the fetched data
                } else {
                    console.error('Error fetching user data:', data.msg);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUserData(); // Call the function to fetch user data
    }, []);

    const handleLogout = async () => {

        const sessionId = localStorage.getItem('sessionId');

        if (!sessionId) {
            console.error('No sessionId found');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Logout successful:', data);
                
                localStorage.removeItem('sessionId');
                
                navigate('/login');
            } else {
                console.error('Logout failed:', data.message);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="homeColWrapper">
            <div className="homeSidebar">

            </div>
            <div className="homeMainDisplay">
                <div className="topMainDisplay">
                    <div className="userInfoDisplay">
                        <p className="usernameDisplay">Welcome {userName}</p>
                    </div>
                    <div className="logoutDisplay">
                        <button className="logout" onClick={handleLogout}>
                            <MdOutlineLogout className="icon" size={32} /> LOGOUT
                        </button>
                    </div>
                </div>
                <div className="bottomMainDisplay">
                    <div className="attendanceTopMenu">
                        <p>Attendance</p>
                        <button className="addAttendanceBtn">
                            Add Attendance
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
};

export default Home;
