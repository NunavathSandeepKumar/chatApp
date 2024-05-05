const asyncHandler = require('express-async-handler')

const User =  require("../models/userModel")
const {generateAccessToken,generateRefreshToken} =  require("../config/generateToken")


const registerUser = asyncHandler( async (req,res) =>{
    const { name,email,password,pic} = req.body;

    if(!name || !email || !password){
        res.status(400).json({message:"Please Enter all the Feilds"})
        throw new Error("Please Enter all the Feilds");
    }
    const userExists = await User.findOne({email:email})
    if(userExists){
        console.log(userExists)
        res.status(400).json({message:"User Already Exists"})
        throw new Error("User Already Exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    })
    if (user){
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshTokens.push(refreshToken);
        await user.save();
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            accessToken:accessToken,
            refreshToken: refreshToken
        })
    }else{
        res.status(400).json({ message: "Invalid Email or Password" })
        // throw new Error("Failed To Create User")
    }
})
const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshTokens.push(refreshToken);
        await user.save();
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            accessToken:accessToken,
            refreshToken: refreshToken
        })
    }
    else{
        res.status(401).json({ message: "Invalid Email or Password" });
    }
})
const getNewAccessToken = asyncHandler(async(req,res)=>{
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required." });
    }

    try {
        // Find user by refresh token
        const user = await User.findOne({ "refreshTokens": refreshToken });

        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token." });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user._id);

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error("Error refreshing access token:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
})
const logout = asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Clear all refresh tokens
        user.refreshTokens = [];

        // Save the user with cleared refresh tokens
        await user.save();

        res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
})
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({}, { password: false, refreshTokens: false });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports  = {registerUser,loginUser,getAllUsers,getNewAccessToken,logout}