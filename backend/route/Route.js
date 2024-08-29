const express = require('express');
const { getUser } = require('../controller/UserController.js')

const router = express.Router();

router.get('/users', getUser);

module.exports = router