import React, { useState } from "react";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddCourse.css";

export default function AddCourse() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const logOutHandler = async () => {
    try {
      await axios.post(`http://localhost:5001/logout`);
      localStorage.clear(); // Optionally clear local storage or session storage
      navigate("/"); // Navigate to the home page or login page after logout
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [professorName, setProfessorName] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:5001/api/courses/addCourse", {
        courseCode,
        courseName,
        professorName,
      }, { withCredentials: true });

      setMessage(`Course ${response.data.course.courseName} added successfully!`);
      setError(null);
      setCourseCode("");
      setCourseName("");
      setProfessorName("");

    } catch (err) {
      setError(err.response?.data?.message || "Failed to add course");
      setMessage(null);
    }
}

  return (
    <div className="homepage">
      <header className="nav1">
        <div className="container">
          <nav className="nav-links">
            <a href="/homepage" className="nav-link">
              Home
            </a>
            <a href="/markAttendance" className="nav-link">
              Mark Attendence
            </a>
            <a href="viewUserAttendance" className="nav-link">
              View Attendence
            </a>
            <div className="dropdown">
              <button
                className="dropdown-button"
                onClick={toggleDropdown}
              >
                Admin actions
              </button>
              {showDropdown && (
                <ul className="dm">
                  <li>
                    <a href="/updateLocation" className="dropdown-item">
                      Update Location of course
                    </a>
                  </li>
                  <li>
                    <a href="/addCourse" className="dropdown-item">
                      Add Course
                    </a>
                  </li>
                  <li>
                    <a href="#manageUsers" className="dropdown-item">
                      View All Users
                    </a>
                  </li>
                  <li>
                    <a href="#viewReports" className="dropdown-item">
                      View Attendence
                    </a>
                  </li>
                </ul>
              )}
            </div>
            <button className="logout-button" onClick={logOutHandler}>
              Logout
            </button>
          </nav>
        </div>
      </header>
      <div className="content">
      <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow-lg bg-dark text-white" style={{width:"1000px"}}>
        <h2 className="text-center">Add New Course</h2>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>

          {/* Course Code */}
          <Form.Group className="mb-3">
            <Form.Label>Course Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Course Code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </Form.Group>

          {/* Course Name */}
          <Form.Group className="mb-3">
            <Form.Label>Course Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </Form.Group>

          {/* Professor Name */}
          <Form.Group className="mb-3">
            <Form.Label>Professor Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Professor Name"
              value={professorName}
              onChange={(e) => setProfessorName(e.target.value)}
              required
            />
          </Form.Group>

          {/* Submit Button */}
          <Button variant="primary" type="submit" className="w-100">
            Add Course
          </Button>
        </Form>
      </Card>
    </Container>
      </div>
      <footer className="footer">
          <p>&copy; 2025 YourAppName. All rights reserved.</p>
      </footer>
    </div>
  );
}
