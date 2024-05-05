const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {authenticateToken} = require('../middleware/authMiddleware')
const chatController = require('../controllers/chatController')

router.post('/',authenticateToken,chatController.accessChat);
router.get('/',authenticateToken,chatController.fetchChat);
router.post('/group',authenticateToken,chatController.createGroupChat);
router.put('/groupuserremove',authenticateToken,chatController.removeFromGroup);
router.put('/addtogroup',authenticateToken,chatController.addToGroup);



module.exports = router