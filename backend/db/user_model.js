const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique:true
    },
    email:{
        type: String,
        required:true,
        unique:true 
    },
    password:{
        type: String,
        required:true 
    },
    role:{
        type:String,
        required:true,
        enum:["admin,user"]
    }
})

const getUserModel = async(companyId)=>{
    const connection = await require('./db').getDatabaseConnection(companyId);
    return connection.model("User",userSchema);
}

module.exports={getUserModel};