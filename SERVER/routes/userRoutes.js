const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {authenticateToken} = require('../middleware/authMiddleware')

router.post("/",userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/token",userController.getNewAccessToken);
router.post("/logout",authenticateToken,userController.logout)
router.get("/users",authenticateToken, userController.getUsers);

module.exports = router