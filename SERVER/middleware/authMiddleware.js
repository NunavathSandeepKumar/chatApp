const jwt = require('jsonwebtoken');
const User =  require("../models/userModel")

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '600s' });
        
        if (!decoded || !decoded.id) {
            return res.sendStatus(401);
        }
        const user = await User.findById(decoded.id);
        // console.log(decoded.id,user)
        if (!user) {
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    } catch (err) {
        console.error("Error verifying JWT:", err);
        return res.sendStatus(401);
    }
}

module.exports = { authenticateToken };
