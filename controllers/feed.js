const { validationResult } = require('express-validator');

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

exports.createPost = (req, res) => {
  const { title, content } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'There was an error when creating a post',
      errors: errors.array(),
    });
  }

  // create in db
  return res.status(201).json({
    message: 'Post created',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: { name: 'John' },
      createdAt: new Date(),
    },
  });
};
