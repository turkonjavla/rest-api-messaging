const express = require('express');
const { HOST, PORT } = require('./keys');

const app = express();

const feed = require('./routes/feed');
app.use('/', feed);

app.listen(PORT, () => {
  console.log(`Server is running on: http://${HOST}:${PORT}`);
});
