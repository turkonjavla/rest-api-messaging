const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res) => {
  res.status(200).json({
    posts: [
      {
        _id: '1',
        title: 'Feed 1',
        content: 'This is a message',
        imageUrl: 'images/desktop.png',
        creator: {
          name: 'John',
        },
        createdAt: new Date(),
      },
    ],
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
