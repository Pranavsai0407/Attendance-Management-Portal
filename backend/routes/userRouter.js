const express = require('express');
const {getAllUsers,getUser,changeRole} = require("../controllers/userController");
const {authenticateToken} = require("../auth/authenticate");
const router = express.Router();

router.get('/getUser',authenticateToken,getUser);
router.get('/getAllUsers',getAllUsers);
router.put('/changeRole',authenticateToken,changeRole);
module.exports=router;