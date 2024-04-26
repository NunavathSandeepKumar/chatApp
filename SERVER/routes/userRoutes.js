const express = require("express");

const router = express.Router();
const {registerUser,authUser,getAllUsers,} = require("../controllers/userController");
const {authenticateToken} = require('../middleware/authMiddleware')

router.post("/user", registerUser);
router.post("/user/login", authUser);
router.get("/users",authenticateToken, getAllUsers);

// router.post("/user/logout", authenticateToken, addToBlacklist)


module.exports = router;
