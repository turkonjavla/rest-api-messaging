const express = require('express');
const graphqlHttp = require('express-graphql');
const cors = require('cors');

const protectedRoute = require('./middleware/protected-route');

const app = express();

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const { HOST, PORT } = require('./keys');

app.use(protectedRoute);
app.use(
  '/graphql',
  cors(),
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

const Middleware = require('./middleware');
Middleware(app);

app.listen(PORT, () => {
  console.log(`Server is running on: http://${HOST}:${PORT}`);
});
