const Course = require("../models/Course");

const getAllCourses = async (req, res, next) => {
    const courses = await Course.find({});
    return res.status(200).json({"courses":courses});
};

const addCourse = async (req, res, next) => {
    //return res.status(201).json({"message":"Connected to endpoint successfully"});
    /*if (!req.user.isAdmin) {
        res.status(400).message("You are not allowed to do this!!");
    }*/
    const { courseCode,courseName,professorName } = req.body;
    const course = await Course.create({
        courseCode,
        courseName,
        professorName,
    });
    return res.status(201).json({"course":course});
};

const updateCourse = async(req,res,next)=>{
    if (!req.user.isAdmin) {
        res.status(400).message("You are not allowed to do this!!");
    }
    const { _id } = req.params;
    const { courseCode,courseName,professorName } = req.body;
    const course = await Course.findByIdAndUpdate(_id, {
        courseCode,
        courseName,
        professorName,
    }, { new: true }); // Return the updated document
    return res.status(200).message("Successfully Updated").json({"course":course});
}

const deleteCourse = async(req,res,next)=>{
    if (!req.user.isAdmin) {
        res.status(400).message("You are not allowed to do this!!");
    }
    const { _id } = req.params;
    const course = await Course.findByIdAndDelete(_id);
    return res.status(201).message(`Deleted ${course.courseName} successfully`);
}

const updateLocation = async (req, res, next) => {
    try {
        const { courseCode, latitude, longitude } = req.body;

        if (!courseCode || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: "Course code, latitude, and longitude are required!" });
        }

        const updatedCourse = await Course.findOneAndUpdate(
            { courseCode },
            {
                $set: {
                    "courseLocation.coordinates": [longitude, latitude] // GeoJSON format [lng, lat]
                }
            },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found!" });
        }

        return res.status(200).json({ message: "Updated course location successfully!", course: updatedCourse });
    } catch (error) {
        console.error("Error updating course location:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports={getAllCourses,addCourse,updateCourse,updateLocation,deleteCourse};