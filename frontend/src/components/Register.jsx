import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import custom styles for the Register page

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [faceImage, setFaceImage] = useState('');
  const [cam, setCam] = useState(false);
  const [captureStatus, setCaptureStatus] = useState(''); // Status for capture
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFaceImage(imageSrc);
    setCam(false); // Turn off webcam
    setCaptureStatus('Picture captured successfully!'); // Update status
  }, [webcamRef]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/register', {
        username,
        password,
        fullname,
        email,
        faceImage,
      });
      alert('User registered successfully');
      navigate('/');
    } catch (error) {
      console.error('Error during registration:', error.response.data);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Create an Account</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <label>Username:</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label>Full Name:</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          {/* Webcam and Capture Feedback */}
          {cam && (
            <div className="webcam-container">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="60%"
                height="60%"
                videoConstraints={{ facingMode: 'user' }}
              />
              <button
                type="button"
                className="capture-button"
                onClick={capture}
              >
                Capture Face
              </button>
            </div>
          )}

          {captureStatus && (
            <><div className="webcam-container">
              <img src={faceImage} alt="Image" width="60%"
                height="60%"/>
            </div>
            <p className="capture-status">{captureStatus}</p> // Display feedback
            </>
          )}
          {!cam && !captureStatus && (
            <button
              type="button"
              className="capture-button"
              onClick={() => setCam(!cam)}
            >
              Take Picture
            </button>
          )}

          {/* Register button */}
          <button type="submit" className="submit-button">
            Register
          </button>
        </form>

        <div className="login-link">
          <p>Already have an account?</p>
          <a href="/" className="login-button">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;
