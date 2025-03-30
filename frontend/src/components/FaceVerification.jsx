import React, { useState } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';


const FaceVerification = () => {
    const webcamRef = React.useRef(null);

    
    const [faceEncoding, setFaceEncoding] = useState(null);
    const [error, setError] = useState('');
    const history = useNavigate();

    const captureFace = (image) => {
        setFaceEncoding(image.getScreenshot());
    };

    const verifyFace = async () => {
        try {
            const response = await axios.post('http://localhost:5001/login', {
                faceEncoding
            });
            localStorage.setItem('token', response.data.token);
            history.push('/courses');
        } catch (err) {
            setError('Face verification failed');
        }
    };

    return (
        <div>
            <h2>Face Verification</h2>
            <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                onUserMedia={() => captureFace(webcamRef.current)}
            />
            {error && <p>{error}</p>}
            <button onClick={verifyFace}>Verify Face</button>
        </div>
    );
};

export default FaceVerification;
