import React, { useEffect, useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { MdOutlineLogout } from "react-icons/md";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import medelaLogo from '../Assets/logo-medela-potentia-white.png'
import { FaCalendar } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { useLocation } from 'react-router-dom';

interface AttendanceRow {
    id: number; 
    date: string;
    checkIn: string;
    checkOut: string;
    photo: string; 
}

const Home = () => {
    const navigate = useNavigate();

    const [userName, setUsername] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('');

    const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<AttendanceRow | null>(null);

    const [isCheckOutDisabled, setIsCheckOutDisabled] = useState<boolean>(false);

    useEffect(() => {
        const getUserData = async () => {
            const sessionId = localStorage.getItem('sessionId');

            if (!sessionId) {
                console.error('No sessionId found');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/checkSession?sessionId=${sessionId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                const data = await response.json();

                if (response.ok) {
                    setUsername(data.name);
                    setUserId(data.userId);
                    setUserRole(data.role);
                } else {
                    console.error('Error fetching user data:', data.msg);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUserData(); 
    }, []);

    useEffect(() => {
        const getAttendanceData = async () => {
            if (!userId) {
                console.error('No userId found');
                return;
            }
    
            try {
                const response = await fetch(`http://localhost:5000/getAttendance?userId=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                const responseText = await response.text();
    
                if (response.ok) {
                    try {
                        const data = JSON.parse(responseText);
                        setAttendanceRows(data);
                    } catch (jsonError) {
                        console.error('Error parsing JSON:', jsonError);
                    }
                } else {
                    console.error('Error fetching attendance data:', response.status, responseText);
                }
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            }
        };

        if (userId) { 
            getAttendanceData();
        }
    }, [userId]); 

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

    const handleClickOpen = (row: AttendanceRow) => {
        setSelectedRow(row);
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
        setSelectedRow(null);
    };

    const handleAddAttendanceClick = () => {
        navigate('/attendance'); 
    };

    const handleAttendanceClick = () => {
        navigate('/Home');
    }

    const handleAdminClick = () => {
        navigate('/Admin');
    }

    useEffect(() => {
        const now = new Date();
        const cutoffTime = new Date();
        cutoffTime.setHours(15, 0, 0);

        setIsCheckOutDisabled(now < cutoffTime);
    }, []); 

    const handleSaveCurrentTime = async () => {
        const currentTime = new Date().toLocaleTimeString('en-US', { 
            timeZone: 'Asia/Jakarta', 
            hour12: false, // Use 24-hour format
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        
        if (selectedRow && selectedRow.id) {
            try {
                const response = await fetch(`http://localhost:5000/attendance${selectedRow.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ checkOut: currentTime }),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    setAttendanceRows(prevRows => 
                        prevRows.map(row => 
                            row.id === selectedRow.id 
                                ? { ...row, checkOut: currentTime } 
                                : row
                        )
                    );
                    alert('Check-out time updated!');
                    console.log('Check-out time updated successfully:', data);
                } else {
                    console.error('Error updating check-out time:', data.msg);
                }
            } catch (error) {
                console.error('Error saving current time:', error);
            }
        } else {
            console.error('No attendance record selected');
        }
    };

    const location = useLocation();

    const isOnSpecificPage = location.pathname === '/home';

    const homeButtonStyle = {
        backgroundColor: isOnSpecificPage ? 'transparent' : '#ffffff',
        color: isOnSpecificPage ? '#ffffff' : 'black',
    };

    return (
        <div className="homeColWrapper">
            <div className="homeSidebar">
                <img src={medelaLogo} alt="" className="medelaLogo" />
                <button className="attendancePageBtn" onClick={handleAttendanceClick} style={homeButtonStyle}>
                    <FaCalendar className='icon' size={20}/>
                    ATTENDANCE
                </button>
                {userRole === 'admin' && (
                    <button className="adminPageBtn" onClick={handleAdminClick}>
                        <MdAdminPanelSettings className='icon' size={22}/>
                        ADMIN PAGE
                    </button>
                )}
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
                        <p>ATTENDANCE</p>
                        <button className="addAttendanceBtn" onClick={handleAddAttendanceClick}>
                            Add
                        </button>
                    </div>
                    <div className="attendanceTableContainer">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="attendance table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell align="right">Check-in</TableCell>
                                        <TableCell align="right">Check-out</TableCell>
                                        <TableCell align="right">Photo</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceRows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            onClick={() => handleClickOpen(row)}
                                            hover
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.date}
                                            </TableCell>
                                            <TableCell align="right">{row.checkIn}</TableCell>
                                            <TableCell align="right">{row.checkOut}</TableCell>
                                            <TableCell align="right">
                                                <img
                                                    src={row.photo}
                                                    alt="Attendance Photo"
                                                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Detail Information</DialogTitle>
                <DialogContent>
                    {selectedRow && (
                        <div>
                            <p><strong>Date:</strong> {selectedRow.date}</p>
                            <p><strong>Check-in:</strong> {selectedRow.checkIn}</p>
                            <p><strong>Check-out:</strong> {selectedRow.checkOut}</p>
                            <p><strong>Photo:</strong></p>
                            <img
                                src={selectedRow.photo}
                                alt="Attendance Photo"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleSaveCurrentTime}
                        color="primary"
                        disabled={isCheckOutDisabled} // Disable button based on state
                    >
                        Check-Out
                    </Button>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Home;
