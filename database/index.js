const mongoose = require(mongoose);
const { MONGO_URI } = require('../keys');

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('> Successfully connected to the database'))
  .catch(err =>
    console.error('Error when connecting to the databse. Error: ', err.message)
  );

const db = mongoose.connection;

db.on('error', () => console.error('Error occured from the database'));
db.once('open', () => console.log('> Successfully accessed the database'));

module.exports = mongoose;
