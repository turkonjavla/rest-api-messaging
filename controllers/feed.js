exports.getPosts = (req, res) => {
  res.status(200).json({ title: 'Feed 1', message: 'This is a message' });
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
