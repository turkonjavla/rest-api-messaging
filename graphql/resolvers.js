const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const { BCRYPT_ROUNDS, JWT_SECRET, JWT_EXPIRES_IN } = require('../keys');

const Post = require('../models/post');
const User = require('../models/user');

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

  login: async function (args, req) {
    const { email, password } = args;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('Invalid email/password');
      error.code = 401;
      throw error;
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      const error = new Error('Invalid email/password');
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return { token, userId: user._id.toString() };
  },

  createPost: async function (args, req) {
    if (req.isAuth !== true) {
      const error = new Error('Not authenticated');
      error.code = 401;
      throw error;
    }

    const { title, content, imageUrl } = args.postInput;
    const errors = [];

    if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
      errors.push({ message: 'Title is invalid' });
    }

    if (
      validator.isEmpty(content) ||
      !validator.isLength(content, { min: 5 })
    ) {
      errors.push({ message: 'Content is invalid' });
    }

    if (errors.length > 0) {
      const error = new Error('There were some errors!');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error('Invalid user ');
      error.data = errors;
      error.code = 401;
      throw error;
    }

    try {
      const newPost = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: user,
      });

      const createdPost = await newPost.save();

      user.posts.push(createdPost);
      await user.save();
      return {
        ...createdPost._doc,
        _id: createdPost._id.toString(),
        createdAt: createdPost.createdAt.toISOString(),
        updatedAt: createdPost.updatedAt.toISOString(),
      };
    } catch (error) {}
  },
  getPosts: async function (args, req) {
    if (req.isAuth !== true) {
      const error = new Error('Not authenticated');
      error.code = 401;
      throw error;
    }

    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find().sort({ createdAt: -1 }).populate('creator');

    return {
      posts: posts.map(post => {
        return {
          ...post._doc,
          _id: post._id.toString(),
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        };
      }),
      totalPosts,
    };
  },
};
