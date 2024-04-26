const asyncHandler = require('express-async-handler')

const User =  require("../models/userModel")
const generateToken =  require("../config/generateToken")


const registerUser = asyncHandler( async (req,res) =>{
    console.log(req.body)
    const { name,email,password,pic} = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }
    const userExists = await User.findOne({email:email})
    if(userExists){
        console.log(userExists)
        res.status(400)
        throw new Error("User Already Exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic
    })
    if (user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("Failed To Create User")
    }
})
const authUser =asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(401);
        throw new Error("Invalid Email or Password")
    }
})

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports  = {registerUser,authUser,getAllUsers}