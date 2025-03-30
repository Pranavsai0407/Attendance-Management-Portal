const express = require('express');
const { markAttendance, location_check, getUserAttendance,getAttendance } = require("../controllers/attendance");
const {authenticateToken} = require("../auth/authenticate");
const router = express.Router();

router.post('/markAttendance',authenticateToken,location_check,markAttendance);
router.get('/getUserAttendance',authenticateToken,getUserAttendance);
router.get('/getAttendance',authenticateToken,getAttendance);

module.exports=router;
