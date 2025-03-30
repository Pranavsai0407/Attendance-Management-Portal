import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container"
import "./MarkAttendance.css";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button"; 

export default function HomePage() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const [courses,setCourses] = useState([]);


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


  const updateLocation = async (course) => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    // Send the updated location to the backend
                    const response = await axios.post("http://localhost:5001/api/courses/updateLocation", {
                        courseCode: course.courseCode,
                        latitude,
                        longitude
                    });

                    alert(`Location of course updated to your current location`);
                } catch (error) {
                    console.error("Error updating location:", error.message);
                    alert("Failed to update location");
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to retrieve location. Make sure location is enabled.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
};


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/courses/getAllCourses`);
        //console.log(response);
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchCourses();
  }, []);
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
      <Container>
          <h1 className="text-center mt-4">Courses</h1>
          <Form>
            <InputGroup className="my-3">
              <Form.Control
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Course Code"
              />
            </InputGroup>
          </Form>
          <Table className="table table-hover table-dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Professor</th>
                <th>Status</th>
                <th>Actions</th> {/* New column for button */}
              </tr>
            </thead>
            <tbody>
              {courses
                .filter((item) =>
                  search.toLowerCase() === ""
                    ? item
                    : item.courseCode.toLowerCase().includes(search.toLowerCase())
                )
                .map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.courseCode}</td>
                    <td>{item.courseName}</td>
                    <td>{item.professorName}</td>
                    <td>{item.acceptingStatus ? "Accepting" : "Not Accepting"}</td>
                    <td>
                      
                      <Button variant="primary" onClick={() => updateLocation(item)}>
                        Update Location
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Container>
      </div>
        <footer className="footer">
          <p>&copy; 2025 YourAppName. All rights reserved.</p>
        </footer>
    </div>
  );
}
