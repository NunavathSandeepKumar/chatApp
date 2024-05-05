const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = expressAsyncHandler(async (req, res) => {
  const  userId  = req.body.userId;
  if (!userId) {
    console.log("userId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password -refreshTokens")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }
  try {
    const createdChat = await Chat.create(chatData);

    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password -refreshTokens"
    );
    res.status(200).send(FullChat);
  } catch (error) {
    throw new Error(error.message);
  }
});

const fetchChat = expressAsyncHandler(async (req, res) => {
  try {
    console.log(req.user._id);
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password -refreshTokens")
      .populate("groupAdmin", "-password -refreshTokens")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    throw new Error(error.message);
  }
});

const createGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "please fill all the feilds " });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are requird to create a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const FullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password -refreshTokens")
      .populate("groupAdmin", "-password -refreshTokens");
    res.status(200).json(FullGroupChat);
  } catch (error) {
    throw new Error(error.message);
  }
});

const addToGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findOneAndUpdate({chatId},{$push: { users: userId },},{ new: true })
    .populate("users", "-password -refreshTokens")
    .populate("groupAdmin", "-password -refreshTokens");

    
  if (!added) {
    res.status(404);
  }
  res.status(200).json({message:"added succesfully"})
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findOneAndUpdate(
    {chatId},
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password -refreshTokens")
    .populate("groupAdmin", "-password -refreshTokens");
  if (!removed) {
    res.status(404);
  }
 res.status(200).json({message:"removed succesfully"})
});
module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  removeFromGroup,
  addToGroup,
};
