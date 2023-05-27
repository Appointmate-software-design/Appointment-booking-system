// Importing necessary modules and components
import React from 'react';
import { deleteDoc, doc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import ShowLinkButton from './ShowLinkButton';
import './EventCard.css';

// This file defines how an event will be displayed on the events page when it is scheduled

// The EventCard component displays the details of an event and provides a way to delete it
export default function EventCard({ eventData }) {

  // This function handles the deletion of an event from the database
  const handleDelete = async () => {
    await deleteDoc(doc(collection(db, 'events'), eventData.id));
  };

  // The return statement defines the layout and style of the event card
  return (
    <div className='EventCard' style={{ maxWidth: '400px' }}>
      <button className='delete-button' onClick={handleDelete}
      onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 1)')}
      onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 0.9)')}
      >Delete</button>
      <div>
        <div className='card-title'> {eventData.title} </div>
        <div className='card-descript'>{eventData.description}</div>
        <div className='duration'>{eventData.duration}<> minutes</></div>
        <div className='dates'>Available: {new Date(eventData.startDate).toLocaleDateString()} - {new Date(eventData.endDate).toLocaleDateString()}</div>
      </div>
      <div style={{ marginTop: '2.5em' }}></div> {/* empty lines for spacing css correctly */}
      <div style={{ position: 'absolute', bottom: '15px'}}>
        <ShowLinkButton eventData={eventData} />
      </div>
    </div>
  )
}
