const jwt = require('jsonwebtoken') ;
const user = require('../models/userModel');
const asyncHandler= require('express-async-handler') ;
const protect =  asyncHandler (async (req , res, next)=>{
    let token  ; 
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(" ")[1] ; 
            const decoded = jwt.verify(token  ,process.env.JWT_secret);
            
            
            req.user = await user.findById(decoded.id).select("-password") ;
            next() ; 
        }
        catch(error){
            res.status(401);
            throw new Error("not Authorized , token failed") ;
        }

    }
    else{
        res.status(401);
        throw new Error("not Authorized , token not there") ;
    }
});
module.exports = {protect};