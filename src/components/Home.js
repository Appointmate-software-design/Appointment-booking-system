// Importing necessary modules and components
import React, { useState } from 'react';
import Title from './Title';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Routes, Route, Outlet } from 'react-router-dom';
import ScheduledEvents from './ScheduledEvents';
import EventList from './EventList';
import Modal from 'react-modal';
import { reauthenticateWithCredential, EmailAuthProvider, getAuth, updatePassword } from 'firebase/auth';
import './Home.css'


// This file contains the Home component which has two buttons, "Scheduled Events" and "Events" and keeps track of which one is active

export default function Home() {

  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const [showEvents, setShowEvents] = useState(true)
  const [showScheduled, setShowScheduled] = useState(false)
  const auth = getAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    setError('')

    try {
      await logout()
      navigate('/login')
    } catch {
      setError("Failed to log out")
      alert(error)
    }
  }

  //function to handle the password change with inputs new,confirm new and old password

  const handleChangePassword = async (e) => {
    e.preventDefault();
  
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      
      reauthenticateWithCredential(user, credential)
        .then(() => {
          // User re-authenticated.
          updatePassword(user, newPassword)
            .then(() => {
              // Password update successful!
              alert('Password changed successfully!');
              setOldPassword('');
              setNewPassword('');
              setConfirmNewPassword('');
              setIsChangePasswordModalOpen(false);
            })
            .catch((error) => {
              // An error occurred
              console.log(error); // Log the error for debugging
              alert('Error during password update, please try again.');
            });
        })
        .catch((error) => {
          // An error occurred
          console.log(error); // Log the error for debugging
          alert('Incorrect old password, please try again.');
        });
    }
    
  };    
  

  // CSS to show that a button is active
  const [activeButton, setActiveButton] = useState('events'); // State to keep track of which button is active, default is 'events'

  // Styles for the two buttons
  const buttonStyles = {
    backgroundColor: activeButton === 'events' ? 'rgba(82, 82, 213, 0.9)' : 'white',
    color: activeButton === 'events' ? 'white' : 'rgb(124, 115, 115)'
  };

  const scheduledButtonStyles = {
    backgroundColor: activeButton === 'scheduled' ? 'rgba(82, 82, 213, 0.9)' : 'white',
    color: activeButton === 'scheduled' ? 'white' : 'rgb(124, 115, 115)'
  };

  // The return statement defines the layout and style of the home page
  return (
    <div>
      <Title />
      <h2 className='welcomeText'>Welcome {currentUser.email}</h2>
      <div>
        <button className='events-btn' style={buttonStyles} onClick={() => {
          setActiveButton('events');
          setShowEvents(true);
          setShowScheduled(false);
        }}>Events</button>
        <button className='scheduled-btn' style={scheduledButtonStyles} onClick={() => {
          setActiveButton('scheduled');
          setShowScheduled(true);
          setShowEvents(false);
        }}>Scheduled Events</button>
        <hr className='line'></hr>
      </div>

      <button className='logout-btn' onClick={handleLogout}
        onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 1)')}
        onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 0.7)')}

      >
        Log Out
      </button>

      {/* The ScheduledEvents and EventList components are conditionally rendered based on the active button */}
      {showScheduled && <ScheduledEvents />}
      {showEvents && <EventList />}
      <button className='password-btn'
        onClick={() => setIsChangePasswordModalOpen(true)}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#008080')}
        onMouseOut={(e) => (e.target.style.backgroundColor = 'teal')}
      >
        Change Password
      </button>
      
  <Modal
    isOpen={isChangePasswordModalOpen}
    onRequestClose={() => setIsChangePasswordModalOpen(false)}
    style={{
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000 // This ensures the modal appears above everything else
      },
      content: {
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        outline: 'none',
        width: '80%',
        maxWidth: '400px',
        zIndex: 1000 // This ensures the modal content appears above everything else
      }
    }}
    contentLabel="Change Password"
  >
      <h3>Change Password</h3>
      <form onSubmit={handleChangePassword}>
        <label>
          Old Password:
          <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
        </label>
        <label>
          New Password:
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </label>
        <label>
          Confirm New Password:
          <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
        </label>
        <button type="submit" className='modalcpassword'
          onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 1)')}
          onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 0.9)')}
        >Change Password</button>
      </form>
      <button onClick={() => setIsChangePasswordModalOpen(false)} className='modalclose'
        onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 1)')}
        onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 0.9)')}
      >Close</button>
    </Modal>
    </div>
    
  )
}
