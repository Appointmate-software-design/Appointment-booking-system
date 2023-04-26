import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'; // <-- Import deleteDoc and doc
import { db } from '../firebase';
import './ScheduledEvents.css';
import { ClipLoader } from 'react-spinners'; //for the loading spinner
import CancelMeetingModal from './CancelMeetingModal';
import { useAuth } from "../contexts/AuthContext";
import emailjs from "emailjs-com";
//this file shows the booked events that the user has on a specific day.

export default function ScheduledEvents() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedEvents, setBookedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [canceledPersonName, setCanceledPersonName] = useState('');
  const { currentUser } = useAuth(); //host of the event

  useEffect(() => {
    if (selectedDate) {
      fetchBookedEvents(selectedDate);
    }
  }, [selectedDate]);


  const fetchBookedEvents = async (date) => {
    const q = query(collection(db, 'bookedEvents'), where('date', '==', date));
  
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      const eventData = doc.data();
      eventData.id = doc.id; // Add the document ID to the event object
      events.push(eventData);
    });
  
    // Function to convert the start time of a time slot to minutes
    const timeToMinutes = (time) => {
      const [hour, minute] = time.split(':');
      return parseInt(hour, 10) * 60 + parseInt(minute, 10);
    };
  
    // Sort the events by time slots (earliest to latest)
    events.sort((a, b) => {
      const timeA = timeToMinutes(a.timeSlot.split('-')[0]);
      const timeB = timeToMinutes(b.timeSlot.split('-')[0]);
      return timeA - timeB;
    });
  
    setBookedEvents(events);
  };
    //check if loading, if it is, then show loading symbol
  if (loading) {
    return <>
      <div className="loading">
        <ClipLoader size={60} color="#123abc" loading={loading} />
        <p>Loading...</p>
      </div>
    </>
  }
  
  
  const cancelMeeting = async (event) => {
    setLoading(true);
    await deleteDoc(doc(db, 'bookedEvents', event.id));
    setSelectedDate(new Date(selectedDate));
    setLoading(false);
    setCanceledPersonName(event.name);
    setIsCancelModalOpen(true);
    console.log(event.email)

  // Send the cancellation email
  emailjs.send(
    "service_kd1nbnm",
    "template_gbi8rtn",
    {
      to_email: event.email,
      name: event.name,
      date: selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      timeSlot: event.timeSlot,
      eventTitle: event.title,
      eventDescription: event.description,
      hostName: currentUser.displayName || currentUser.email,
    },
    "-U8Z9iJC2NXirC-38"
  );


  };
  

  return (
    <div>
        <div className="scheduled-events-container">
    <h3>Scheduled Events</h3>
    </div>
    <p>Please select a day from today:</p>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        minDate={new Date()}
        dateFormat="yyyy-MM-dd"
      />

      <div>
        <table className="scheduled-events-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Event Description</th>
              <th>Time Slot</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th> {/* Add a new column for the "Cancel Meeting" button */}
            </tr>
          </thead>
          <tbody>
            {bookedEvents.map((event, index) => (
              <tr key={index}>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{event.timeSlot}</td>
                <td>{event.name}</td>
                <td>{event.email}</td>
                <td>
                <button
                    className="cancel-meeting-button"
                    onClick={() => cancelMeeting(event)}
                  >
                    Cancel Meeting
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CancelMeetingModal
      isOpen={isCancelModalOpen}
      onClose={() => setIsCancelModalOpen(false)}
      name={canceledPersonName}
    />
    </div>
  );
}
