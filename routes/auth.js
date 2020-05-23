const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');

const router = express.Router();

const authController = require('../controllers/auth');

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .not()
      .isEmpty()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('Email already exists');
          }
        });
      })
      .normalizeEmail(),
    body('password').trim().not().isEmpty().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ],
  authController.signup
);
router.post('/login', authController.login);

module.exports = router;
