const express = require('express');
const { getUser, registerUser, loginUser, permissionCheck } = require('../controller/UserController.js')

const router = express.Router();

router.get('/users', getUser);
router.post('/users', registerUser);
router.post('/login', loginUser);

module.exports = router