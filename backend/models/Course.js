const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    courseCode: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    professorName: { type: String, required: true },
    courseLocation: {
        type: { type: String, enum: ['Point'], required: true ,default:"Point"}, // Always "Point"
        coordinates: { type: [Number], required:true,default: [0, 0]},
    },
    acceptingStatus:{type:Boolean,default:false},
});
module.exports = mongoose.model("Course", CourseSchema);

