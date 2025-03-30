import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/user/getUser`,{ withCredentials: true });
        console.log(response.data.user[0].isAdmin);
        setAdmin(response.data.user[0].isAdmin); // Assuming response contains userType
      } catch (error) {
        console.log('error');
        console.log(error);
        navigate('/');
      }
    };
    isLoggedIn();
  }, [navigate]);

  const logOutHandler = async () => {
    try {
      await axios.post(`http://localhost:5001/logout`,{ withCredentials: true });
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
            <a href="viewUserAttendance" className="nav-link">
              View Attendence
            </a>
            {admin &&
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
                    <a href="/users" className="dropdown-item">
                      View All Users
                    </a>
                  </li>
                  <li>
                    <a href="/viewAttendance" className="dropdown-item">
                      View Attendence
                    </a>
                  </li>
                </ul>
              )}
            </div>
            }
            <button className="logout-button" onClick={logOutHandler}>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2 className="hero-title">Posts</h2>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h3 className="section-title">Made with:</h3>
          <div className="feature-cards">
            {[
              {
                title: "Fast Performance",
                description:
                  "Optimized for speed and efficiency to save your time.",
              },
              {
                title: "User Friendly",
                description: "An intuitive interface designed for everyone.",
              },
              {
                title: "Secure",
                description: "Your data is encrypted and secure with us.",
              },
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
          <p>&copy; 2025 YourAppName. All rights reserved.</p>
      </footer>
    </div>
  );
}
