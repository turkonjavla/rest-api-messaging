const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images'),
  filename: (req, file, cb) =>
    cb(null, `${new Date().toISOString()}-${file.originalname}`),
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpf' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const CommonMidldewware = app => {
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use((error, req, res, next) => {
    console.error(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message });
  });
  app.use('/images', express.static(path.join(__dirname, '..', 'images')));
  app.use(
    multer({
      storage: fileStorage,
      fileFilter,
    }).single('image')
  );
};

const Middleware = app => {
  CommonMidldewware(app);
};

module.exports = Middleware;
