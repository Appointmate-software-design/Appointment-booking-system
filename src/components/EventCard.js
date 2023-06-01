// Importing necessary modules and components
import React, { useState } from 'react';
import { deleteDoc, doc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import ShowLinkButton from './ShowLinkButton';
import './EventCard.css';
import { useNavigate } from 'react-router-dom';

// The EventCard component displays the details of an event and provides a way to delete it
export default function EventCard({ eventData }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  // This function handles the deletion of an event from the database
  const handleDelete = async () => {
    await deleteDoc(doc(collection(db, 'events'), eventData.id));
  };
//This function handles the editing of an event
  const editEvent = async () => {
    await handleDelete();
    navigate("/create-event", { state: { eventData: eventData } });
  };
// Defining CSS styles for the cards
  const cardStyles = {
    maxWidth: '400px',
    transition: 'transform 0.3s',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)'
  };

  // The return statement defines the layout and style of the event card
  return (
    <div 
      className='EventCard' 
      style={cardStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className='delete-button' onClick={handleDelete}>Delete</button>
      <button className='edit-button' onClick={editEvent} style={{position: 'absolute', right: '10px', top: '10px'}}>Edit</button>
      <div>
        <div style={{ fontSize: '1.6em' }}><strong>Title:</strong> <span style={{ wordWrap: 'break-word' }}>{eventData.title}</span></div>
        <div><strong style={{ fontSize: '1.3em' }}>Description:</strong> <span style={{ wordWrap: 'break-word' }}>{eventData.description}</span></div>
        <div><strong>Duration:</strong> {eventData.duration}<> minutes</></div>
        <div><strong>Date Range:</strong> {new Date(eventData.startDate).toLocaleDateString()} - {new Date(eventData.endDate).toLocaleDateString()}</div>
      </div>
      <div style={{ marginTop: '2.5em' }}></div>
      <div style={{ position: 'absolute', bottom: '0.3em'}}>
        <ShowLinkButton eventData={eventData} />
      </div>
    </div>
  )
}

