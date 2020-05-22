const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');

const router = express.Router();

const authController = require('../controllers/auth');

router.post('/signup', authController.signup);

module.exports = router;
