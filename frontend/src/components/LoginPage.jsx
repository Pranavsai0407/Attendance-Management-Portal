import React, { useState } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const webcamRef = React.useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [faceEncoding, setFaceEncoding] = useState(null);
  const [error, setError] = useState("");
  const [isCaptured, setIsCaptured] = useState(false);
  const [cam, setCam] = useState(false);
  const history = useNavigate();

  // Login request to the backend
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/login", {
        username,
        password,
        faceEncoding,
      },{ withCredentials: true });
      //localStorage.setItem("token", response.data.token);
      console.log(response);
      
      history("/homepage");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // Capture face image from webcam
  const captureFace = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    // Remove the "data:image/jpeg;base64," prefix
    const base64Image = imageSrc.replace(/^data:image\/jpeg;base64,/, "");

    setFaceEncoding(base64Image);
    setIsCaptured(true);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Welcome Back!</h2>
        <p className="login-subtitle">Login to access your account</p>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {cam && (
            <div className="webcam-container">
              {!isCaptured ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="60%"
                    height="60%"
                    videoConstraints={{ facingMode: "user" }}
                  />
                  <button
                    type="button"
                    className="capture-button"
                    onClick={captureFace}
                  >
                    Capture Face
                  </button>
                </>
              ) : (
                <p className="capture-message">Picture Captured Successfully!</p>
              )}
            </div>
          )}

          {!cam && (
            <button
              type="button"
              className="capture-button"
              onClick={() => setCam(!cam)}
            >
              Take Picture
            </button>
          )}

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="submit-button">
            Login
          </button>
        </form>

        <div className="register-link">
          <p>Don't have an account?</p>
          <Link to="/register" className="register-button">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
