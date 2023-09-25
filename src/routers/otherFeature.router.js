const express = require('express');
const { LogoController, BannerController, ShopSystemController } = require('../controllers/otherFeature.controller');
const AuthorMiddlewareChecking = require('../middleware/athorization.middleware');
const router = express.Router();

/** logo route */
router.get('/logo', AuthorMiddlewareChecking.checkAccessToken, LogoController.getAllLogo);
router.get('/logo/:id', AuthorMiddlewareChecking.checkAccessToken, LogoController.getDetailLogo);
router.post('/logo',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, LogoController.createLogo);
router.put('/logo/:id',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, LogoController.updateLogo);
router.delete('/logo/:id',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, LogoController.deleteLogo);

/** banner route */
router.get('/banner',AuthorMiddlewareChecking.checkAccessToken, BannerController.getAllBanner);
router.get('/banner/:id',AuthorMiddlewareChecking.checkAccessToken, BannerController.getDetailBanner);
router.post('/banner',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, BannerController.createBanner);
router.put('/banner/:id',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, BannerController.updateBanner);
router.delete('/banner/:id',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, BannerController.deleteBanner);

/** shop system route */
router.get('/shopSystem',AuthorMiddlewareChecking.checkAccessToken, ShopSystemController.getAll);
router.get('/shopSystem/:id',AuthorMiddlewareChecking.checkAccessToken, ShopSystemController.getDetail);
router.post('/shopSystem',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, ShopSystemController.createShopSystem);
router.put('/shopSystem/:id',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, ShopSystemController.updateShopSystem);
router.delete('/shopSystem/:id',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, ShopSystemController.deleteShopSystem);

module.exports = router;