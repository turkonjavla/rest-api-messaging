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

  console.log(title, content);
  // create in db
  return res.status(201).json({
    message: 'Post created',
    post: { id: new Date().toISOString(), title, content },
  });
};
