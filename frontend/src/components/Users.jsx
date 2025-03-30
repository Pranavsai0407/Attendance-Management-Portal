import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button"; 
import "./MarkAttendance.css";

export default function Users() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);

  const logOutHandler = async () => {
    try {
      await axios.post(`http://localhost:5001/logout`);
      localStorage.clear(); // Optionally clear local or session storage
      navigate("/"); // Navigate to the home page or login page after logout
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Memoize changeRole so that its reference doesn't change on every render.
  const changeRole = useCallback(async (user) => {
    const newRole = user.isAdmin ? 'user' : 'admin'; // Toggle role
    try {
      const response = await axios.put(
        `http://localhost:5001/api/user/changeRole/?username=${user.username}`,
        { role: newRole },
        {withCredentials:true}
      );
      console.log(response.data.message);
      // Use functional update to avoid dependency on the current users array.
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u._id === user._id ? { ...u, isAdmin: !u.isAdmin } : u
        )
      );
    } catch (error) {
      console.error('Error updating admin status', error);
    }
  }, []);

  // Fetch users only once on mount.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/user/getAllUsers`);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="homepage">
      <header className="nav1">
        <div className="container">
          <nav className="nav-links">
            <a href="/homepage" className="nav-link">Home</a>
            <a href="/markAttendance" className="nav-link">Mark Attendence</a>
            <a href="viewUserAttendance" className="nav-link">View Attendence</a>
            <div className="dropdown">
              <button className="dropdown-button" onClick={toggleDropdown}>
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
          <h1 className="text-center mt-4">Users</h1>
          <Form>
            <InputGroup className="my-5">
              <Form.Control
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Username"
              />
            </InputGroup>
          </Form>
          <Table className="table table-hover table-dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th> {/* New column for button */}
              </tr>
            </thead>
            <tbody>
              {users
                .filter((item) =>
                  search.toLowerCase() === ""
                    ? item
                    : item.username.toLowerCase().includes(search.toLowerCase())
                )
                .map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.username}</td>
                    <td>{item.fullname}</td>
                    <td>{item.email}</td>
                    <td>{item.isAdmin ? "Admin" : "User"}</td>
                    <td>
                      <Button variant="primary" onClick={() => changeRole(item)}>
                        Change Role
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
