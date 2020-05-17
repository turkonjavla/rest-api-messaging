const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const CommonMidldewware = app => {
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(bodyParser.json());
};

const Middleware = app => {
  CommonMidldewware(app);
};

module.exports = Middleware;
