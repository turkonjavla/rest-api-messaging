const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');

const CommonMidldewware = app => {
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use((error, req, res, next) => {
    console.error(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message });
  });
};

const Middleware = app => {
  CommonMidldewware(app);
};

module.exports = Middleware;
