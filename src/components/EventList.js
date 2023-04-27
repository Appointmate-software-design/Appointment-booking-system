// Importing required libraries and components
import React, { useContext, useState } from 'react'
import CreateEventForm from './CreateEventForm'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useCollection } from 'react-firebase-hooks/firestore'
import './EventList.css'
import EventCard from './EventCard'
import { db } from '../firebase'
import { ClipLoader } from 'react-spinners'; //for the loading spinner

//this file lists all the events as event cards on our events page

// Defining a function component called EventList
export default function EventList() {
  const { currentUser } = useAuth() // Getting current user from AuthContext
  const eventsCollection = collection(db, 'events')  // Accessing 'events' collection from Firebase Firestore
  const eventsQuery = query(eventsCollection, where("host", '==', currentUser.uid
  ))
  const [eventsSnapshot, loading, error] = useCollection(eventsQuery) // Using Firebase Firestore hook to retrieve events collection
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const handleClose = () => {
    setShowModal(false)
  }
  
  const events = eventsSnapshot?.docs // Getting the documents from eventsSnapshot
 

// Rendering the component
  return <div>
    {showModal && <div className='create-new-event'>
      <CreateEventForm handleClose={handleClose} />
    </div>}
    <div className='events-list'>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <h1>Events:</h1>
    </div>
      <button style={{
          backgroundColor: 'dodgerblue',
          color: 'black',
          fontSize: '18px',
          padding: '10px 20px',
          marginTop: '20px',
          marginLeft: '20px',
          marginBottom: '20px',
          border: '2px solid cyan',
          borderRadius: '10px'}} onClick={() => { navigate('create-event') }}>Create New Event</button> {/* this button navigates to the /create-event route, where we are shown a form and can create an event */}
          {loading && (
            <div className="loading">
              <ClipLoader size={60} color="#123abc" loading={loading} />
              <p>Loading...</p>
            </div>
          )} {/*if code is loading, show that it is*/}
      <ul>{events?.map((event) => {
        const eventData = event.data()
        
        return <EventCard eventData={{...eventData, id:event.id}}  // Rendering EventCard component with the event data
        />
      })}</ul>
      
      
    </div>
  </div>

}

