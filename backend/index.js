const express = require("express");
const dotenv = require("dotenv");
const { validateRegistration } = require("./auth/validationMiddleware");
const courseRouter = require("./routes/courseRouter");
const attendanceRouter = require("./routes/attendanceRouter");
const userRouter = require("./routes/userRouter");
const app = express();
const { DBConnection } = require("./database/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const { rekognition, uploadImage } = require("./awsConfig");
const { cookie } = require("express-validator");

app.use(cors({
  origin: `http://localhost:3000`,
  credentials: true,
}));

dotenv.config();
DBConnection();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/register", validateRegistration, async (req, res) => {
  try {
    //get all data from frontend
    const { fullname, username, email, password, faceImage } = req.body;
    //console.log(faceImage);
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ message: "Username already exists" });

    if (!faceImage) return res.status(400).json({ message: "Image required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    //const faceImageUrl = await uploadImage(faceImage, `${username}-face.jpg`);
    //console.log()
    const user = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      faceImage,
    });

    user.password = undefined;
    res
      .status(200)
      .json({ message: "You have successfully registered!", user });
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password, faceEncoding } = req.body;

    if (!(username && password && faceEncoding)) {
      return res.status(400).send("Please enter all the details");
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    req.user=user;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });


    if (user.isAdmin) {
      const token = jwt.sign(
        { id: user._id, username: user.username, isAdmin: user.isAdmin },
        process.env.SECRET_KEY,
        { expiresIn: "30d" }
      );
      
    
    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
      //console.log(token);
      res.cookie('token',token,options);
      //console.log(req.cookies.token);
      return res.status(200).json({
        message: "You have successfully logged in!",
        success: true,
        token,
      });
    }

    
    if (faceEncoding) {
      const params = {
        SourceImage: {
          Bytes: Buffer.from(faceEncoding.replace('data:image/jpeg;base64,', ''), "base64"),
        },
        TargetImage: {
          Bytes: Buffer.from(user.faceImage.replace('data:image/jpeg;base64,', ''), "base64"),
        },
        SimilarityThreshold: 80, // Set your threshold for face matching
      };

      rekognition.compareFaces(params, (err, data) => {
        if (err) {
          console.error("Rekognition Error:", err.message);
          return res.status(500).json({ message: "Face verification error" });
        }

        if (!data.FaceMatches || !data.FaceMatches.length) {
          return res.status(400).json({ message: "Face verification failed" });
        }

        const match = data.FaceMatches[0];
        console.log(match.Similarity);
        if (match.Similarity >= 95) {
          const token = jwt.sign(
            { id: user._id, username: user.username, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );
          console.log("OK");
          console.log(match.Similarity);
    //store token in cookies with options
    const options = {
      expires: new Date(Date.now() + 1 * 1 * 60 * 60 * 1000),
      httpOnly: true, //only manipulated by server not by client/frontend
    };
          return res.status(200).cookie("token", token,options).json({
            message: "You have successfully logged in!",
            success: true,
            token,
          });
        } else {
          return res
            .status(400)
            .json({ message: "Face match below threshold" });
        }
      });
    } else {
      return res.status(400).json({ message: "No face encoding provided" });
    }
  } catch (error) {
    console.log(error.message);
  }
});



app.post("/logout", (req, res) => {
  console.log(1);
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  res.status(200).json({ message: "You have successfully logged out!" });
});


app.use("/api/courses",courseRouter);
app.use("/api/attendance",attendanceRouter)
app.use("/api/user",userRouter)
app.get("/", (req, res) => {
  res.send("Hello world");
});

app
  .listen(process.env.PORT, () => {
    console.log(`Server is listening on Port ${process.env.PORT}!`);
  })
  .on("error", (err) => {
    console.error("Server startup error:", err);
  });
