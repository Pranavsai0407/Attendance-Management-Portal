import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Register from './components/Register';
import FaceVerification from './components/FaceVerification';
import HomePage from './components/HomePage';
import MarkAttendance from './components/MarkAttendance';
import AddCourse from './components/AddCourse';
import UpdateLocation from './components/UpdateLocation';
import ViewUserAttendance from './components/ViewUserAttendance';
import ViewAttendance from './components/ViewAttendance';
import Users from './components/Users';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/face-verification" element={<FaceVerification />} />
        <Route path="/homepage" element={<HomePage/>} />
        <Route path="/addCourse" element={<AddCourse/>} />
        <Route path="/markAttendance" element={<MarkAttendance />} />
        <Route path="/updateLocation" element={<UpdateLocation/>} />
        <Route path="/viewUserAttendance" element={<ViewUserAttendance/>}/>
        <Route path="/viewAttendance" element={<ViewAttendance/>}/>
        <Route path="/users" element={<Users/>}/>
      </Routes>
    </Router>
  );
}

export default App;
