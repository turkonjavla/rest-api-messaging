const express = require('express');
const path = require('path');
const fs = require('fs');
const graphqlHttp = require('express-graphql');
const cors = require('cors');

const protectedRoute = require('./middleware/protected-route');

const app = express();

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const { HOST, PORT } = require('./keys');

const Middleware = require('./middleware');
Middleware(app);

app.use(protectedRoute);
app.put('/post-image', (req, res) => {
  if (!req.isAuth) {
    throw new Error('Not authenticated');
  }
  console.log('Req file: ', req.file);

  if (!req.file) {
    return res.status(200).json({ message: 'No file provided' });
  }

  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }

  return res
    .status(201)
    .json({ message: 'File stored', filePath: req.file.path });
});
app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occured';
      const code = err.originalError.code || 500;

      return {
        message,
        code,
        data,
      };
    },
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on: http://${HOST}:${PORT}`);
});

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.error(err));
};
