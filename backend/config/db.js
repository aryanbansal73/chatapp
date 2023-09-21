const mongoose = require('mongoose')
const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.mongo_url , {
            useNewUrlParser :true ,
            useUnifiedTopology : true ,
        });
        console.log('connected with db')
    }
    catch(error){
        console.log(error) ;
    }
}
module.exports = connectDB