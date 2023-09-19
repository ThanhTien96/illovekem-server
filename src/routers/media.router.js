const express = require('express');
const MediaController = require('../controllers/media.controller');
const { uploadMediaCloud } = require('../middleware/uploadProduct');
const AuthorMiddlewareChecking = require('../middleware/athorization.middleware');
const router = express.Router();

router.get('/media',AuthorMiddlewareChecking.checkAccessToken, MediaController.getAllMedia);
router.post('/media',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isSupperAdmin, uploadMediaCloud.single('image'), MediaController.uploadMedia);
router.delete('/media',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isSupperAdmin, MediaController.deleteMedia);

module.exports = router;
