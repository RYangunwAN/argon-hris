import React, { useEffect, useState } from 'react';
import './Admin.css';
import { useNavigate } from 'react-router-dom';
import { MdOutlineLogout } from "react-icons/md";
import medelaLogo from '../Assets/logo-medela-potentia-white.png';
import { FaCalendar } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
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
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useLocation } from 'react-router-dom';
import { Style } from '@mui/icons-material';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Attendance {
    id: number;
    date: string;
    checkIn: string;
    checkOut: string;
    photo: string; 
}

const Admin = () => {
    const navigate = useNavigate();
    const [userName, setUsername] = useState<string>('');
    const [userId, setUserId] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [openAttendanceModal, setOpenAttendanceModal] = useState<boolean>(false);
    const [attendance, setAttendance] = useState<Attendance[]>([]);

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

        const getUsers = async () => {
            const sessionId = localStorage.getItem('sessionId');

            if (!sessionId) {
                console.error('No sessionId found');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/users`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setUsers(data);
                } else {
                    console.error('Error fetching user data:', data.msg);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUserData();
        getUsers();
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

    const handleAttendanceBtnClick = () => {
        navigate('/Home');
    };

    const handleAdminBtnClick = () => {
        navigate('/Admin');
    };

    const location = useLocation();

    const isOnSpecificPage = location.pathname === '/admin';

    const adminButtonStyle = {
        backgroundColor: isOnSpecificPage ? 'transparent' : '#ffffff',
        color: isOnSpecificPage ? '#ffffff' : 'black',
    };

    const handleEditClick = async (user: User) => {
        setSelectedUser(user);
        setOpenEditModal(true);
    };

    const handleAttendanceClick = async (userId: number) => {
        try {
            const response = await fetch(`http://localhost:5000/getAttendance?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setAttendance(data);
                console.log(data);
                setOpenAttendanceModal(true);
            } else {
                console.error('Error fetching attendance data:', data.msg);
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
        setSelectedUser(null);
    };

    const handleCloseAttendanceModal = () => {
        setOpenAttendanceModal(false);
        setAttendance([]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>, field: keyof User) => {
        if (selectedUser) {
            setSelectedUser({
                ...selectedUser,
                [field]: e.target.value,
            });
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch(`http://localhost:5000/users/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedUser),
            });

            if (response.ok) {
                console.log('User updated successfully');
                setOpenEditModal(false);

                const updatedUsers = await fetchUsers();
                setUsers(updatedUsers);
            } else {
                console.error('Error updating user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const fetchUsers = async () => {
        const sessionId = localStorage.getItem('sessionId');
        if (!sessionId) return [];

        try {
            const response = await fetch(`http://localhost:5000/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return [];
        }
    };

    return (
        <div className="adminColWrapper">
            <div className="adminSidebar">
                <img src={medelaLogo} alt="" className="medelaLogo" />
                <button className="attendancePageBtn" onClick={handleAttendanceBtnClick}>
                    <FaCalendar className='icon' size={20} />
                    ATTENDANCE
                </button>
                {userRole === 'admin' && (
                    <button className="adminPageBtn" onClick={handleAdminBtnClick} style={adminButtonStyle}>
                        <MdAdminPanelSettings className='icon' size={22} />
                        ADMIN PAGE
                    </button>
                )}
            </div>
            <div className="adminMainDisplay">
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
                    <div className="adminTopMenu">
                        <p>EMPLOYEE DATA</p>
                    </div>
                    <div className="adminTableContainer">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="user table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">Email</TableCell>
                                        <TableCell align="right">Role</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id} hover style={{ cursor: 'pointer' }} onClick={() => handleAttendanceClick(user.id)}>
                                            <TableCell component="th" scope="row">
                                                {user.name}
                                            </TableCell>
                                            <TableCell align="right">{user.email}</TableCell>
                                            <TableCell align="right">{user.role}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    onClick={(e) => { e.stopPropagation(); handleEditClick(user); }}
                                                    color="primary"
                                                >
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>

            <Dialog open={openEditModal} onClose={handleCloseEditModal}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <div>
                            <TextField
                                label="Name"
                                value={selectedUser.name}
                                onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>, 'name')}
                                fullWidth
                                margin="dense"
                            />
                            <TextField
                                label="Email"
                                value={selectedUser.email}
                                onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>, 'email')}
                                fullWidth
                                margin="dense"
                            />
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Role</InputLabel>
                                <Select
                                    value={selectedUser.role}
                                    onChange={(e) => handleInputChange(e as React.ChangeEvent<{ name?: string; value: unknown }>, 'role')}
                                    label="Role"
                                >
                                    <MenuItem value="member">Member</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditModal}>Cancel</Button>
                    <Button onClick={handleSaveEdit} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAttendanceModal} onClose={handleCloseAttendanceModal} PaperProps={{style: {width: '100%', maxWidth: '1200px'}}}>
                <DialogTitle>Attendance Records</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="attendance table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell align="right">Check-In</TableCell>
                                    <TableCell align="right">Check-Out</TableCell>
                                    <TableCell align="right">Photo</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attendance.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell component="th" scope="row">
                                            {record.date}
                                        </TableCell>
                                        <TableCell align="right">{record.checkIn}</TableCell>
                                        <TableCell align="right">{record.checkOut}</TableCell>
                                        <TableCell align="right">
                                            <img src={record.photo} alt="Attendance" style={{ width: '100px' }} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAttendanceModal}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Admin;
