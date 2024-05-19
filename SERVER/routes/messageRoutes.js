const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {authenticateToken} = require('../middleware/authMiddleware')
const messageControllers = require('../controllers/messageControllers')

router.post('/',authenticateToken,messageControllers.sendMessage);
router.get('/:chatId',authenticateToken,messageControllers.allMessages);

module.exports = router