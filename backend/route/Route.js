const express = require('express');
const { getUser, registerUser, loginUser, checkSession, logoutUser } = require('../controller/UserController.js')
const { createAttendance, getAttendanceByUser, updateAttendance, deleteAttendance } = require('../controller/AttendanceController.js');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// user data api
router.get('/users', getUser);
router.post('/users', registerUser);
router.post('/login', loginUser);
router.get('/checkSession', checkSession);
router.post('/logout', logoutUser);

// attendance data api
router.post('/attendance', upload.single('photo'), createAttendance);
router.get('/getAttendance', getAttendanceByUser);
router.put('/attendance/:id', updateAttendance);
router.delete('/attendance/:id', deleteAttendance);

module.exports = router