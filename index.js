const express = require('express');
const graphqlHttp = require('express-graphql');

const app = express();

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const { HOST, PORT } = require('./keys');

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);

const Middleware = require('./middleware');
Middleware(app);

app.listen(PORT, () => {
  console.log(`Server is running on: http://${HOST}:${PORT}`);
});
