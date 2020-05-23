const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');
const protectedRoute = require('../middleware/protected-route');

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

router.get('/status', protectedRoute, authController.getUserStatus);
router.patch(
  '/status',
  [protectedRoute, body('status').trim().not().isEmpty()],
  authController.updateUserStatus
);

module.exports = router;
