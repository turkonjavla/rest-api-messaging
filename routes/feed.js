const router = require('express').Router();
const feedController = require('../controllers/feed');

router.get('/posts', feedController.getPosts);

module.exports = router;
