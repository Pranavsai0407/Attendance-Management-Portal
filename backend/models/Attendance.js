const mongoose = require("mongoose");

const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
};

const AttendanceSchema = new mongoose.Schema({
    username: { type: String, required: true }, 
    courseCode: { type: String, required: true }, 
    courseName: { type: String, required: true }, 
    date: { type: Date, required: true, default: Date.now },
    time: { type: String, required: true, default: getCurrentTime } 
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
