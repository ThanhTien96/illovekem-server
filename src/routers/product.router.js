const express = require('express');
const { ProductTypeController, ProductController } = require('../controllers/product.controller');
const { uploadCloudProduct } = require('../middleware/uploadProduct');
const AuthorMiddlewareChecking = require('../middleware/athorization.middleware');

const router = express.Router();

/** product type route */
router.get('/productType',AuthorMiddlewareChecking.checkAccessToken, ProductTypeController.getAllProductType);
router.get('/productTypeWithProduct',AuthorMiddlewareChecking.checkAccessToken, ProductTypeController.getAllProductTypeWithProduct);
router.get('/productType/:id',AuthorMiddlewareChecking.checkAccessToken,ProductTypeController.getDetailProductType);
router.get('/productByProductType/:id',AuthorMiddlewareChecking.checkAccessToken,ProductTypeController.getProductTypeWithProduct);
router.post('/productType',AuthorMiddlewareChecking.checkAccessToken, AuthorMiddlewareChecking.isAuthorization, ProductTypeController.createProductType);
router.put('/productType/:id',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, ProductTypeController.updateProductType);
router.delete('/productType/:id',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, ProductTypeController.deleteProductType);


/** product route */
router.get('/product',AuthorMiddlewareChecking.checkAccessToken, ProductController.getAllProducts);
router.get('/productWithType',AuthorMiddlewareChecking.checkAccessToken, ProductController.getProductIncludeType);
router.get('/product/:id', AuthorMiddlewareChecking.checkAccessToken, ProductController.getDetailProduct);
router.post('/product',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, uploadCloudProduct.array("media", 6),ProductController.createProduct);
router.put('/product/:id',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, uploadCloudProduct.array("media", 6), ProductController.updateProduct);
router.delete('/product/:id',AuthorMiddlewareChecking.checkAccessToken,AuthorMiddlewareChecking.isAuthorization, ProductController.deleteProduct);



module.exports = router;