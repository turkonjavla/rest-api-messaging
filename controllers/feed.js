const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      if (!posts) {
        const error = new error('No posts found');
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({ posts });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const { title, content } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('There was an error when creating a post');
    error.statusCode = 422;
    throw error;
  }

  // create in db
  const post = new Post({
    title,
    content,
    imageUrl: 'images/someJSON.png',
    creator: { name: 'John' },
  });

  post
    .save()
    .then(result => {
      console.log(result);
      return res.status(201).json({
        message: 'Post created',
        post: result,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getSinglePost = (req, res, next) => {
  const postId = req.params.postId;
  console.log('Post id: ', postId);
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error(`Couldn't find post`);
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({ message: 'Post fetched', post });
    })
    .catch(err => {
      if (err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
