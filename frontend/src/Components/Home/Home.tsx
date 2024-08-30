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
    const [attendanceRows, setAttendanceRows] = useState<AttendanceRow[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<AttendanceRow | null>(null);

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
            console.log(userId);
            
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
                console.log('Response text:', responseText);
    
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

    return (
        <div className="homeColWrapper">
            <div className="homeSidebar">
                {/* Sidebar content */}
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
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Home;
