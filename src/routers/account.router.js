const express = require('express');
const AccountColtroller = require('../controllers/account.controller');
const AuthorMiddlewareChecking = require('../middleware/athorization.middleware');
const router = express.Router();


router.get('/getToken', AccountColtroller.getAppToken);
router.post('/login',AccountColtroller.userLogin);
router.get('/profile', AuthorMiddlewareChecking.isAuthorization, AccountColtroller.fetchProfile);

module.exports = router