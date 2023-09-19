const express = require("express");
const {
  UserTypeController,
  UserController,
} = require("../controllers/user.controller");
const { uploadAvatar } = require("../middleware/uploadProduct");
const AuthorMiddlewareChecking = require("../middleware/athorization.middleware");
const router = express.Router();

/** user type */
router.get(
  "/userType",
  AuthorMiddlewareChecking.checkAccessToken,
  AuthorMiddlewareChecking.isAuthorization,
  UserTypeController.getAll
);
router.get(
  "/userType/:id",
  AuthorMiddlewareChecking.checkAccessToken,
  AuthorMiddlewareChecking.isAuthorization,
  UserTypeController.getDetail
);
router.post(
  "/userType",
  AuthorMiddlewareChecking.checkAccessToken,
  AuthorMiddlewareChecking.isAuthorization,
  UserTypeController.createUserType
);
router.put(
  "/userType/:id",
  AuthorMiddlewareChecking.checkAccessToken,
  AuthorMiddlewareChecking.isAuthorization,
  UserTypeController.updateType
);
router.delete(
  "/userType/:id",
  AuthorMiddlewareChecking.checkAccessToken,
  AuthorMiddlewareChecking.isAuthorization,
  UserTypeController.deleteType
);

/** user account */
router.get(
  "/user",
  AuthorMiddlewareChecking.checkAccessToken,
  AuthorMiddlewareChecking.isAuthorization,
  UserController.getAllUser
);
router.get(
  "/user/:id",
  AuthorMiddlewareChecking.checkAccessToken,
  AuthorMiddlewareChecking.isAuthorization,
  UserController.getDetailUser
);
router.post(
  "/user",
  AuthorMiddlewareChecking.checkAccessToken,
  AuthorMiddlewareChecking.isSupperAdmin,
  uploadAvatar.single("avatar"),
  UserController.createUser
);
router.put(
  "/user/:id",
  AuthorMiddlewareChecking.checkAccessToken,
  AuthorMiddlewareChecking.isSupperAdmin,
  uploadAvatar.single("avatar"),
  UserController.updateUser
);
router.delete(
  "/user/:id",
  AuthorMiddlewareChecking.checkAccessToken,
  AuthorMiddlewareChecking.isSupperAdmin,
  UserController.deleteUser
);

module.exports = router;
