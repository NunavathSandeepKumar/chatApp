const jwt = require('jsonwebtoken');


const generateAccessToken = (id) =>{
    return jwt.sign({id},process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2d' })
    // const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    // const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    // return { accessToken:accessToken, refreshToken:refreshToken }
}
const generateRefreshToken = (id) =>{
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

module.exports = {generateAccessToken,generateRefreshToken};