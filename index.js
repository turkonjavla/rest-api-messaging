const express = require('express');
const { HOST, PORT } = require('./keys');

const app = express();
const Middleware = require('./middleware');

Middleware(app);

const feed = require('./routes/feed');
app.use('/feed', feed);

app.listen(PORT, () => {
  console.log(`Server is running on: http://${HOST}:${PORT}`);
});
