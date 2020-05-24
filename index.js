const express = require('express');
const { HOST, PORT } = require('./keys');

const app = express();
const Middleware = require('./middleware');

Middleware(app);

const feed = require('./routes/feed');
const auth = require('./routes/auth');

app.use('/feed', feed);
app.use('/auth', auth);

app.listen(PORT, () => {
  console.log(`Server is running on: http://${HOST}:${PORT}`);
});
