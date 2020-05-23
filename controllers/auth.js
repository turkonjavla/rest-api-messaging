const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const { JWT_SECRET, JWT_EXPIRES_IN } = require('../keys');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const { email, name, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const newUser = new User({
        email: email,
        password: hashedPassword,
        name: name,
      });

      return newUser.save();
    })
    .then(result =>
      res.status(201).json({ message: 'User created', userId: result._id })
    )
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        const error = new Error('Invalid email/password ');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Invalid email/password ');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        }
      );
      res.status(200).json({ token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUserStatus = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error(`User doesn't exist`);
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        status: user.status,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUserStatus = (req, res, next) => {
  const newStatus = req.body.status;

  User.findById(req.userId)
    .then(user => {
      if (!user) {
        const error = new Error(`User doesn't exist`);
        error.statusCode = 404;
        throw error;
      }

      user.status = newStatus;
      return user.save();
    })
    .then(() => res.status(200).json({ message: 'User status updated' }))
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
