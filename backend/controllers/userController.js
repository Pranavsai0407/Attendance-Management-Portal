const User = require("../models/User");

const getAllUsers = async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({"users":users});
};

const getUser = async(req,res,next)=>{
    const username = req.user.username;
    const user = await User.find({username},"-password");
    return res.status(200).json({"user":user});
};

const changeRole=async (req, res) => {
    const { role } = req.body; // Assuming { "role": "admin" } or { "role": "user" }
    if (!role) return res.status(400).json({ message: 'Role is required.' });
  
    try {
      const user = await User.findOne({username:req.query.username});
      
      if (!user) return res.status(404).json({ message: 'User not found.' });
      
      // Update the admin field based on the role value
      user.isAdmin= role === 'admin';
  
      // Save the updated user document
      await user.save();
  
      res.json({ message: `Admin role updated successfully for user ${user.username}.`, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  };
module.exports={getAllUsers,getUser,changeRole};