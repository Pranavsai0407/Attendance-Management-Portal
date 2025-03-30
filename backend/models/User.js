const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email:{type:String,required:true,unique: true},
    fullname: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    faceImage: { type: String, required: true }, // Base64 encoded face image
});
module.exports = mongoose.model("User", userSchema);
