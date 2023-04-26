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
      <button className='delete-button' onClick={handleDelete}>Delete</button>
      <div>
        <div style={{ fontSize: '1.6em' }}><strong>Title:</strong> <span style={{ wordWrap: 'break-word' }}>{eventData.title}</span></div>
        <div><strong style={{ fontSize: '1.3em' }}>Description:</strong> <span style={{ wordWrap: 'break-word' }}>{eventData.description}</span></div> {/* Description must be larger but not its contents */}
        <div><strong>Duration:</strong> {eventData.duration}<> minutes</></div>
        <div><strong>Date Range:</strong> {new Date(eventData.startDate).toLocaleDateString()} - {new Date(eventData.endDate).toLocaleDateString()}</div>
      </div>
      <div style={{ marginTop: '2.5em' }}></div> {/* empty lines for spacing css correctly */}
      <div style={{ position: 'absolute', bottom: '0.3em'}}>
        <ShowLinkButton eventData={eventData} />
      </div>
    </div>
  )
}
