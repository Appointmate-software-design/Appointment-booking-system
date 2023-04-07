import React from 'react';
import { deleteDoc, doc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import ShowLinkButton from './ShowLinkButton';
import './EventCard.css';

// the purpose of the below function is to define a function that can be used to delete a specific document from our Firebase database.
export default function EventCard({ eventData }) {
  const handleDelete = async () => {
    await deleteDoc(doc(collection(db, 'events'), eventData.id));
  };


  return (
    <div className='EventCard' style={{ maxWidth: '400px' }}>
      <button className='delete-button' onClick={handleDelete}>Delete</button>
      <div>
      <div style={{ fontSize: '1.6em' }}><strong>Title:</strong> <span style={{ wordWrap: 'break-word' }}>{eventData.title}</span></div>
      <div><strong style={{ fontSize: '1.3em' }}>Description:</strong> <span style={{ wordWrap: 'break-word' }}>{eventData.description}</span></div> {/* Description must be larger but not its contents */}

        <div><strong>Duration:</strong> {eventData.duration}<> minutes</></div>
        <div><strong>Date Range:</strong> {new Date(eventData.startDate).toLocaleDateString()} - {new Date(eventData.endDate).toLocaleDateString()}</div>
      </div >
      <div style={{ marginTop: '2.5em' }}></div> {/* empty lines for spacing css correctly */}
      <div style={{ position: 'absolute', bottom: '0.3em'}}>
      <ShowLinkButton eventData={eventData} />
      </div>
    </div>
  )
  
}


