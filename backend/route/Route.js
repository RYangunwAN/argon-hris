const express = require('express');
const { getUser, registerUser, loginUser, checkSession, logoutUser, updateUser } = require('../controller/UserController.js')
const { createAttendance, getAttendanceByUser, updateAttendance, deleteAttendance } = require('../controller/AttendanceController.js');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// user data api
router.get('/users', getUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/checkSession', checkSession);
router.post('/logout', logoutUser);
router.put('/users/:id', updateUser);

// attendance data api
router.post('/attendance', upload.single('photo'), createAttendance);
router.get('/getAttendance', getAttendanceByUser);
router.put('/attendance:id', updateAttendance);
router.delete('/attendance:id', deleteAttendance);

module.exports = router