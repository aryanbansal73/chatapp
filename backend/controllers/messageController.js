const asyncHandler = require("express-async-handler");
const Message = require('../models/messageModel');
const user = require("../models/userModel");
const chat = require("../models/chatModel");
const sendMessage = asyncHandler(async (req,res)=>{
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };
    try{
        var message = await Message.create(newMessage);
        // console.log(message) ;

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await user.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });
        // console.log('done') ;
        // console.log(typeof(message)) ; 
        await chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        res.json(message) ;
    }
    catch(error){
        res.status(400) ; 
        throw new Error(error.message) ;
    }

});
const allmessages = asyncHandler( async (req , res) =>{
    try{
        const messages = await Message.find({chat:req.params.chatId}).populate("sender", "name pic email").populate("chat");
        res.json(messages) ;
    }
    catch(error){
        res.status(400) ; 
        throw new Error(error.message) ;
    }
})
module.exports = {sendMessage , allmessages} ;