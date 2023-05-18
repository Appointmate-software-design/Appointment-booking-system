// Importing necessary modules and components
import React, { useState } from 'react';
import Title from './Title';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Routes, Route, Outlet } from 'react-router-dom';
import ScheduledEvents from './ScheduledEvents';
import EventList from './EventList';
import Modal from 'react-modal';
import { reauthenticateWithCredential, EmailAuthProvider, getAuth, updatePassword } from 'firebase/auth';


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
    padding: '10px 20px',
    fontSize: '20px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    marginRight: '20px',
    backgroundColor: activeButton === 'events' ? 'teal' : 'white',
    color: activeButton === 'events' ? 'white' : 'black'
  };

  const scheduledButtonStyles = {
    padding: '10px 20px',
    fontSize: '20px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: activeButton === 'scheduled' ? 'teal' : 'white',
    color: activeButton === 'scheduled' ? 'white' : 'black'
  };

  // The return statement defines the layout and style of the home page
  return (
    <div>
      <Title />
      <h2>Welcome {currentUser.email}</h2>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button style={buttonStyles} onClick={() => {
          setActiveButton('events');
          setShowEvents(true);
          setShowScheduled(false);
        }}>Events</button>
        <button style={scheduledButtonStyles} onClick={() => {
          setActiveButton('scheduled');
          setShowScheduled(true);
          setShowEvents(false);
        }}>Scheduled Events</button>
      </div>

      <button onClick={handleLogout}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'teal',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '1px 1px 2px grey',
          marginBottom: '20px',
          marginRight: '20px'
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#008080')}
        onMouseOut={(e) => (e.target.style.backgroundColor = 'teal')}

      >
        Log Out
      </button>

      {/* The ScheduledEvents and EventList components are conditionally rendered based on the active button */}
      {showScheduled && <ScheduledEvents />}
      {showEvents && <EventList />}
      <button
        onClick={() => setIsChangePasswordModalOpen(true)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'teal',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '1px 1px 2px grey',
          marginBottom: '20px',
          marginRight: '20px'
        }}
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
        borderRadius: '4px',
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
        <button type="submit">Change Password</button>
      </form>
      <button onClick={() => setIsChangePasswordModalOpen(false)}>Close</button>
    </Modal>
    </div>
    
  )
}
