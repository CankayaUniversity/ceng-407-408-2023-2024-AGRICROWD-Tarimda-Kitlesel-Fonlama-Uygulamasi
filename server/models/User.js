import mongoose from 'mongoose';

const UserTable = new mongoose.Schema({
    name : {type: String, required:true},
    email : {type: String, required:true, unique:true},
    password : {type: String, required:true}
}) 

const UserModel = mongoose.model("users", UserTable)
module.exports = UserModel