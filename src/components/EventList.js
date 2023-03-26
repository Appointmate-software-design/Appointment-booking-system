import React, {useState} from 'react'
import CreateEventForm from './CreateEventForm'
import './EventList.css'


export default function EventList() {

    const [showModal,setShowModal] = useState(false)
    const handleClose = () => {
        setShowModal(false)
    } 
  return (

    <div>
         {showModal && <div className='create-new-event'>
            <CreateEventForm handleClose = {handleClose}/>
            </div>} 
            <div className='events-list'>
            <h1>Events</h1>
            {/* fetch event data, display it according to what we said in meeting -Ria and Thabiso */}
      <button onClick={() => setShowModal(true)}>Create Event</button>
        </div>
    </div>
  )
}
