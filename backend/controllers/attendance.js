const Attendance = require("../models/Attendance");
const Course = require("../models/Course");

const markAttendance = async (req, res, next) => {
    try {
        const { courseCode, courseName,latitude,longitude } = req.body;

        const username = req.user.username;


        const attendance = new Attendance({
            username,
            courseCode,
            courseName
        });

        await attendance.save();
        res.status(201).json({ message: "Attendance marked successfully", attendance });

    } catch (error) {
        next(error);
    }
};


const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;

    const R = 6371000; // Earth's radius in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};

const location_check = async (req, res, next) => {
    try {
        const { courseCode, courseName,latitude, longitude } = req.body;

        if (!courseCode || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: "Course code, latitude, and longitude are required!" });
        }

        const course = await Course.findOne({ courseCode });

        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }

        const [courseLongitude, courseLatitude] = course.courseLocation.coordinates;


        const distance = haversineDistance(courseLatitude, courseLongitude, latitude, longitude);
        console.log(distance);
        if (distance <= 200) {
            next();
        } else {
            return res.status(403).json({ message: "You are too far from the course location to mark attendance.", distance: `${distance.toFixed(2)} meters` });
        }
    } catch (error) {
        console.log("OOOA")
        console.error("Error checking location:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getStartDate = (filter) => {
    const now = new Date();
    switch (filter) {
        case "1day":
            return new Date(now.setDate(now.getDate() - 1));
        case "1week":
            return new Date(now.setDate(now.getDate() - 7));
        case "1month":
            return new Date(now.setMonth(now.getMonth() - 1));
        case "2months":
            return new Date(now.setMonth(now.getMonth() - 2));
        case "3months":
            return new Date(now.setMonth(now.getMonth() - 3));
        case "4months":
            return new Date(now.setMonth(now.getMonth() - 4));
        default:
            return null;
    }
};

const getUserAttendance = async (req, res) => {
    try {
        
        const username=req.user.username;
        const filter  = req.query;
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }
        console.log(filter);
        
        let query = { username };
        const startDate = getStartDate(filter.filter);
        if (startDate) {
            query.date = { $gte: startDate };
        }
   
        const attendanceRecords = await Attendance.find(query).sort({ date: -1 });
        console.log(1);
        res.json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const getAttendance = async (req, res) => {
    try {
        const filter  = req.query;
        //console.log(filter);
        
        const startDate = getStartDate(filter.filter);
        let query = {};
        if (startDate) {
            query.date = { $gte: startDate };
        }
        const attendanceRecords = await Attendance.find(query).sort({ date: -1 });
        
        console.log(attendanceRecords);
        res.json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports={markAttendance,location_check,getUserAttendance,getAttendance};
