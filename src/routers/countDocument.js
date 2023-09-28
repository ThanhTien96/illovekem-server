const express = require('express');
const AuthorMiddlewareChecking = require('../middleware/athorization.middleware');
const { CountDocument } = require('../controllers/countDocument');
const router = express.Router();


router.get('/countSystem', CountDocument.countAllDocument);

module.exports = router;

