const express = require('express');
const { getUser, registerUser, loginUser, checkSession, logoutUser } = require('../controller/UserController.js')

const router = express.Router();

router.get('/users', getUser);
router.post('/users', registerUser);
router.post('/login', loginUser);
router.get('/checkSession', checkSession);
router.get('/logout', logoutUser);

module.exports = router