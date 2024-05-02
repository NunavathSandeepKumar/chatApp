const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {authenticateToken} = require('../middleware/authMiddleware')

router.post("/user",userController.registerUser);
router.post("/user/login", userController.loginUser);
router.post("/user/token",userController.getNewAccessToken);
router.post("/user/logout",authenticateToken,userController.logout)
router.get("/users",authenticateToken, userController.getAllUsers);

module.exports = router