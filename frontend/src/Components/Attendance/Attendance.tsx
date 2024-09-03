import React, { useState, useEffect, useRef } from 'react';
import './Attendance.css';
import { TextField, Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';

const AddAttendance = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<string>('');
  const [checkIn, setCheckIn] = useState<string>('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null); 
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const getUserData = async () => {
      const sessionId = localStorage.getItem('sessionId');

      if (!sessionId) {
        console.error('No sessionId found');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/checkSession?sessionId=${encodeURIComponent(sessionId)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUserId(data.userId); 
        } else {
          console.error('Error fetching user data:', data.msg);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setVideoDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId); 
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    getVideoDevices();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!date || !checkIn || !photo || userId === null) {
      alert('All fields, including the photo and user ID, are required.');
      return;
    }

    const formData = new FormData();
    formData.append('date', date);
    formData.append('checkIn', checkIn);
    formData.append('userId', userId.toString());
    if (photo) {
      const blob = await fetch(photo).then(r => r.blob());
      formData.append('photo', blob, 'photo.jpg');
    }

    try {
      const response = await fetch('http://localhost:5000/attendance', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert('Attendance added successfully!');

        setDate('');
        setCheckIn('');
        setPhoto(null);
        setUserId(null);

        navigate('/home');
      } else {
        alert(`Error: ${result.msg}`);
      }
    } catch (error) {
      console.error('Error adding attendance:', error);
      alert('An error occurred while adding attendance.');
    }
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPhoto(imageSrc);
      setIsCameraOpen(false);
    }
  }, [webcamRef]);

  return (
    <div className="attendanceWrapper">
      <div className="attendanceFormContainer">
        <Typography variant="h5" gutterBottom>
          Add Attendance
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputProps={{ style: { backgroundColor: 'white' } }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Check-in Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                InputProps={{ style: { backgroundColor: 'white' } }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              {isCameraOpen ? (
                <>
                  <FormControl fullWidth>
                    <InputLabel>Webcam</InputLabel>
                    <Select
                      value={selectedDeviceId}
                      onChange={(e) => setSelectedDeviceId(e.target.value as string)}
                    >
                      {videoDevices.map(device => (
                        <MenuItem key={device.deviceId} value={device.deviceId}>
                          {device.label || `Camera ${device.deviceId}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    videoConstraints={{ deviceId: selectedDeviceId }}
                  />
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#004da9' }}
                    onClick={capture}
                  >
                    Capture Photo
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#004da9' }}
                    onClick={() => setIsCameraOpen(true)}
                  >
                    Open Camera
                  </Button>
                  <Typography>
                    {photo ? 'Photo captured' : 'Click to open camera'}
                  </Typography>
                </>
              )}
              {photo && (
                <div className="photoPreview">
                  <img src={photo} alt="Captured" style={{ maxWidth: '100%', marginTop: '16px' }} />
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#004da9' }}
                type="submit"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
};

export default AddAttendance;
