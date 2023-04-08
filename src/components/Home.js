import React, { useState } from 'react';
import Title from './Title';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Routes, Route, Outlet } from 'react-router-dom';
import ScheduledEvents from './ScheduledEvents';
import EventList from './EventList';

//this file has two buttons, "Scheduled Events" and "Events" and keeps track of which one is active

export default function Home() {

  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const [showEvents, setShowEvents] = useState(true)
  const [showScheduled, setShowScheduled] = useState(false)
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

  //css to show that a button  is active, 
  const [activeButton, setActiveButton] = useState('events'); //state to keep track of which button is active,default is events

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
      {showScheduled && <ScheduledEvents />}
      {showEvents && <EventList />}
    </div>
  )
}
