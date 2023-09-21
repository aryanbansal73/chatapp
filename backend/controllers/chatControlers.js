const asyncHandler = require('express-async-handler');
const chat = require('../models/chatModel');
const user = require('../models/userModel');
const { default: mongoose } = require('mongoose');

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await chat.find({
    isGroupChat: false,
    $and: [
      { users: { $eq: req.user._id } },
      { users: { $eq: userId } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await user.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    console.log('hi') ;
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [(req.user._id.toHexString()), userId],
    };
    try {
      const createdChat = await chat.create(chatData);
      console.log(createdChat) ;
      const FullChat = await chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
      console.log(isChat) ;
  }
});
const fetchChats =asyncHandler(async (req,res)=>{
  try{
    chat.find({users:{$elemMatch:{$eq:req.user._id}}})
      .populate('users' , "-password" )
      .populate('groupAdmin' , '-password')
      .populate('latestMessage')
        .sort({updatedAt:-1}) 
       .then(async (results) =>{
        results = await user.populate(results,{
            path: "latestMessage.sender",
            select: "name pic email",
        });
        res.status(200).send(results) ;
       }) 
  }
  catch(error){
    res.status(400) ;
    throw new Error(error.message) ;
  }
});
const createGroupchat =asyncHandler(async (req,res)=>{
  if(!req.body.users || !req.body.name){
    return res.status(400).send({message:"please fill all the fields "} ) ;
  }
  var users = JSON.parse(req.body.users) ;
  if (users.length<2){
    return res.status(400).send("more than 2 users are required to form a group chat") ;
  }
  users.push(req.user) ;
  try{
    const groupChat = await chat.create({
      chatName :req.body.name ,
      users:users,
      isGroupChat:true,
      groupAdmin:req.user , 
    });
    const fullGroupchat = await chat.findOne({_id:groupChat._id})
    .populate('users' , '-password')
    .populate('groupAdmin' ,'-passsword') ;
    res.status(200).json(fullGroupchat) ;

  }catch(error){
    res.status(400) ;
    throw new Error(error.message) ;
  }
});
const renameGroup = asyncHandler(async (req,res) => {
  const {chatId , chatName} = req.body;
  const updatedChat =await  chat.findByIdAndUpdate(chatId,{
    chatName:chatName 
  },{
    new:true ,
  }
  ).populate('users','-password' )
  .populate('groupAdmin', '-password') ;
  if(!updatedChat){
    res.status(404);
    throw new Error('chat Not Found') ;
  }else{
    res.json(updatedChat) ;
  }
});
const addToGroup = asyncHandler( async (req,res) =>{
  const {chatId, userId} = req.body ;
  const added = await chat.findByIdAndUpdate(
    chatId,{
      $push :{users:userId}
    },{
      new:true
    }
    
  ).populate('users' , '-password') 
  .populate('groupAdmin' , '-password') ;
  if(!added){
    res.status(404);
    throw new Error("chat not found") ;
  }
  else{
    res.json(added) ;
  }
});
const removeFromGroup = asyncHandler( async (req,res) =>{
  const {chatId, userId} = req.body ;
  const removed =await chat.findByIdAndUpdate(
    chatId,{
      $pull :{users:userId}
    },{
      new:true
    }
    
  ).populate('users' , '-password') 
  .populate('groupAdmin' , '-password') ;
  if(!removed){
    res.status(404);
    throw new Error("chat not found") ;
  }
  else{
    res.json(removed) ;
  }
});
module.exports = {accessChat,fetchChats,createGroupchat,renameGroup,addToGroup,removeFromGroup};
