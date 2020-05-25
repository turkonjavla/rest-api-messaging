const User = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const { BCRYPT_ROUNDS } = require('../keys');

module.exports = {
  createUser: async function (args, req) {
    const { email, password, name } = args.userInput;
    let errors = [];

    if (!validator.isEmail(email)) {
      errors.push({ message: 'Invalid email' });
    }

    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: 'Password must be at least 5 characters long' });
    }

    if (errors.length > 0) {
      const error = new Error('There were some errors!');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    try {
      const user = await User.findOne({ email });

      if (user) {
        const error = new Error('The user with that email already exists');
        error.statusCode = 422;
        throw error;
      }

      const hashedPassword = await bcrypt.hash(
        password,
        parseInt(BCRYPT_ROUNDS)
      );

      const newUser = new User({
        name: name,
        password: hashedPassword,
        email: email,
      });

      const createdUser = await newUser.save();

      return {
        ...createdUser._doc,
        _id: createdUser._id.toString(),
      };
    } catch (error) {
      console.error('Error when creating a user: ', error.message);
    }
  },
};
