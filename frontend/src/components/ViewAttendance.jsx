import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ViewUserAttendance.css"; // Ensure this file contains the provided styles
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container"

const Attendance = () => {
  const [filter1, setFilter1] = useState("");
  const [filter2, setFilter2] = useState("1day");
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      
      const response = await axios.get(
        `http://localhost:5001/api/attendance/getAttendance?filter=${filter2}`,
        { withCredentials: true }
      );
      setAttendance(response.data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };
  const logOutHandler = async () => {
    try {
      const res=await axios.post(`http://localhost:5001/logout`,{ withCredentials: true });
      console.log(res);
      localStorage.clear(); // Optionally clear local storage or session storage
      navigate("/"); // Navigate to the home page or login page after logout
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

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
            <a href="/viewUserAttendance" className="nav-link">
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
                    <a href="/viewAttendance" className="dropdown-item">
                      View Attendance
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
          <h2>View Attendance</h2>
          <Form>
            <InputGroup className="searchbox">
              <Form.Control
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Course Code"
              />
            </InputGroup>
          </Form>
          <Form>
            <InputGroup className="searchbox">
              <Form.Control
                onChange={(e) => setFilter1(e.target.value)}
                placeholder="Search Username"
              />
            </InputGroup>
          </Form>
          <div className="input-group">
            <select
              value={filter2}
              onChange={(e) => setFilter2(e.target.value)}
              className="dropdown-button"
            >
              <option value="1day">Last 1 Day</option>
              <option value="1week">Last 1 Week</option>
              <option value="1month">Last 1 Month</option>
              <option value="2months">Last 2 Months</option>
              <option value="3months">Last 3 Months</option>
              <option value="4months">Last 4 Months</option>
            </select>
            <button onClick={fetchAttendance} className="dropdown-button">
              Search
            </button>
          </div>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          <table className="attendance-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Course Name</th>
                <th>Course Code</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {attendance
              .filter((item) =>
                search.toLowerCase() === ""
                  ? item
                  : item.courseCode.toLowerCase().includes(search.toLowerCase())
              )
              .filter((item) =>
                  filter1.toLowerCase() === ""
                  ? item
                  : item.username.toLowerCase().includes(filter1.toLowerCase())
              ).map((record, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{record.username}</td>
                  <td>{record.courseName}</td>
                  <td>{record.courseCode}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
      </div>
      <footer className="footer">
        <p>&copy; 2025 YourAppName. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Attendance;
