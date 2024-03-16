const mongoose = require('mongoose');

const UserTable = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  country: String,
  city: String,
  gender: String,
  age: Number,
  phone: String,
});

const UserModel = mongoose.model("users", UserTable);

module.exports = UserModel;
