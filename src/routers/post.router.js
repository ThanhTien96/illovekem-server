const express = require('express');
const PostController = require('../controllers/post.controller');
const { uploadNewsImages } = require('../middleware/uploadProduct');
const router = express.Router();
const AuthorMiddlewareChecking = require('../middleware/athorization.middleware')

router.get('/post', AuthorMiddlewareChecking.checkAccessToken, PostController.getPostPerPage);
router.get('/post/:id', AuthorMiddlewareChecking.checkAccessToken, PostController.getDetailPost);
router.post('/post', AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isSupperAdmin, AuthorMiddlewareChecking.isAuthorization,uploadNewsImages.array('media', 6), PostController.createPost);
router.put('/post/:id', AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isSupperAdmin,AuthorMiddlewareChecking.isAuthorization,uploadNewsImages.array('media', 6), PostController.updatePost);
router.delete('/post/:id', AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isSupperAdmin, AuthorMiddlewareChecking.isAuthorization,PostController.deletePost)

module.exports = router;