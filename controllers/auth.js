const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_ROUNDS } = require('../keys');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const { email, name, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, parseInt(BCRYPT_ROUNDS));
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
    });

    const newUser = await user.save();
    res.status(201).json({ message: 'User created', userId: newUser._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('Invalid email/password ');
      error.statusCode = 401;
      throw error;
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      const error = new Error('Invalid email/password ');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({ token, userId: user._id.toString() });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error(`User doesn't exist`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ status: user.status });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error(`Uer doesn't exist`);
      error.statusCode = 404;
      throw error;
    }

    user.status = newStatus;
    await user.save();

    res.status(200).json({ message: 'Status updated' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
