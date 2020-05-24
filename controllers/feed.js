const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const io = require('../socket');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate('creator')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({ posts, totalItems });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  const { title, content } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('There was an error when creating a post');
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;

  const post = new Post({
    title,
    content,
    imageUrl,
    creator: req.userId,
  });

  try {
    await post.save();
    const user = await User.findById(req.userId);

    user.posts.push(post);
    await user.save();

    io.getIo().emit('posts', {
      action: 'create',
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
    });

    res.status(201).json({
      message: 'Post created',
      post,
      creator: {
        _id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getSinglePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error(`Couldn't find post`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: 'Post fetched', post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const { title, content } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, submittd data is incorrect');
    error.statusCode = 422;
    throw error;
  }

  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error('No image provided');
    error.statusCode = 422;
    throw error;
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error(`Couldn't find post`);
      error.statusCode = 303;
      throw error;
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized');
      error.statusCode = 404;
      throw error;
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    const updatedPost = await post.save();
    res.status(200).json({ message: 'Post updated', updatedPost });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error(`Post doesn't exist`);
      error.statusCode = 422;
      throw error;
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized');
      error.statusCode = 404;
      throw error;
    }

    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(postId);

    await user.save();

    res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.error(err));
};
