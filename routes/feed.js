const router = require('express').Router();
const feedController = require('../controllers/feed');
const { body } = require('express-validator');

const protectedRoute = require('../middleware/protected-route');

router.get('/posts', protectedRoute, feedController.getPosts);
router.post(
  '/post',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
    protectedRoute,
  ],
  feedController.createPost
);
router.get('/post/:postId', protectedRoute, feedController.getSinglePost);
router.put(
  '/post/:postId',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
    protectedRoute,
  ],
  feedController.updatePost
);
router.delete('/post/:postId', protectedRoute, feedController.deletePost);

module.exports = router;
