const express = require('express');
const {getAllCourses,updateCourse,updateLocation,addCourse,deleteCourse} =require("../controllers/courseController");
const router = express.Router();

router.get('/getAllCourses',getAllCourses);
router.put('/updateCourse/:_id',updateCourse);
router.post('/updateLocation',updateLocation);
router.post('/addCourse',addCourse);
router.delete('/deleteCourse',deleteCourse);

module.exports=router;