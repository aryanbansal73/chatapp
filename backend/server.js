const express = require("express");
const {chats} = require('./data/data') ;
const dotenv = require('dotenv' );
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes')
const chatroutes = require('./routes/chatroutes')
const messageroutes = require('./routes/messageroutes') ;
const {errorHandler , notfound} = require('./middleware/errorMiddleware')
dotenv.config() ;
const app =  express() ;
connectDB() ;
app.use(express.json()) ;
app.get('/',(req,res)=>{
    res.send("api is running") ;
});
app.use('/api/user', userRoutes)
app.use('/api/chat' , chatroutes)
app.use('/api/message' , messageroutes)

app.use(notfound) ; 
app.use(errorHandler) ;
const PORT = process.env.PORT ||5000 ;
app.listen(PORT , console.log(PORT)) ;