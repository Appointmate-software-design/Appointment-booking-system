import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore'; 
import { db } from '../firebase';
import './ScheduledEvents.css';
import { ClipLoader } from 'react-spinners';
import CancelMeetingModal from './CancelMeetingModal';
import { useAuth } from "../contexts/AuthContext";
import emailjs from "emailjs-com";
import { Timestamp } from "firebase/firestore";
import RescheduleMeetingModal from './RescheduleMeetingModal';


export default function ScheduledEvents() {
    // State variables

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [bookedEvents, setBookedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [canceledPersonName, setCanceledPersonName] = useState('');
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduledPersonName, setRescheduledPersonName] = useState('');
  const { currentUser } = useAuth(); 
  // Fetch booked events on date range change

  useEffect(() => {
    if (startDate && endDate) {
      fetchBookedEvents(startDate, endDate);
    }
  }, [startDate, endDate]);

  // Function to fetch booked events from Firestore

  const fetchBookedEvents = async (startDate, endDate) => {
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);
    
    const q = query(
      collection(db, 'bookedEvents'), 
      where('date', '>=', startTimestamp),
      where('date', '<=', endTimestamp),
      where('host', '==', currentUser.uid),
      orderBy('date', 'asc')
    );
  
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      const eventData = doc.data();
      eventData.id = doc.id;
      events.push(eventData);
    });
      // Helper function to convert time to minutes

    const timeToMinutes = (time) => {
      const [hour, minute] = time.split(':');
      return parseInt(hour, 10) * 60 + parseInt(minute, 10);
    };
  
    // Sort first by date, then by time within each date
    events.sort((a, b) => {
      const dateA = a.date.toDate();
      const dateB = b.date.toDate();
  
      // If the dates are different, sort by date
      if (dateA.getDate() !== dateB.getDate() || dateA.getMonth() !== dateB.getMonth() || dateA.getFullYear() !== dateB.getFullYear()) {
        return dateA - dateB;
      }
  
      // If the dates are the same, sort by time
      const timeA = timeToMinutes(a.timeSlot.split('-')[0]);
      const timeB = timeToMinutes(b.timeSlot.split('-')[0]);
      return timeA - timeB;
    });
  
    setBookedEvents(events);
  };
  
  // Show loading spinner

  if (loading) {
    return (
      <div className="loading">
        <ClipLoader size={60} color="#123abc" loading={loading} />
        <p>Loading...</p>
      </div>
    )
  }
    // Function to cancel a meeting

  const cancelMeeting = async (event) => {
    setLoading(true);
    await deleteDoc(doc(db, 'bookedEvents', event.id));
    setStartDate(new Date());
    setLoading(false);
    setCanceledPersonName(event.name);
    setIsCancelModalOpen(true);

        // Send cancellation email

    emailjs.send(
      "service_kd1nbnm",
      "template_gbi8rtn",
      {
        email_type: 'cancelled',
        to_email: event.email,
        name: event.name,
        date: startDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        timeSlot: event.timeSlot,
        eventTitle: event.title,
        eventDescription: event.description,
        hostName: currentUser.displayName || currentUser.email,
      },
      "-U8Z9iJC2NXirC-38"
    );
  };
  // Function to reschedule a meeting

  const rescheduleMeeting = async (event) => {
    setLoading(true);
    await deleteDoc(doc(db, 'bookedEvents', event.id));
    setStartDate(new Date());
    setLoading(false);
    setRescheduledPersonName(event.name);
    setIsRescheduleModalOpen(true);
      // Send reschedule email

    emailjs.send(
      "service_kd1nbnm",
      "template_gbi8rtn",
      {
        email_type: 'rescheduled',
        to_email: event.email,
        name: event.name,
        date: startDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        timeSlot: event.timeSlot,
        eventTitle: event.title,
        eventDescription: event.description,
        hostName: currentUser.displayName || currentUser.email,
      },
      "-U8Z9iJC2NXirC-38"
    );
    
  };
  
  // Render scheduled events and action buttons

  return (
    <div>
      <div className="scheduled-events-container">
        <h3>Scheduled Events</h3>
      </div>
      <p>Please select a date range:</p>
      <p>Start date:</p>
      <div>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            if (endDate && date > endDate) {
              alert('Start date cannot be after or the same as end date');
              return;
            }
            setStartDate(date);
          }}
          dateFormat="yyyy-MM-dd"
        />
        <p>End date:</p>
        <DatePicker
          selected={endDate}
          onChange={(date) => {
            if (date < startDate) {
              alert('End date cannot be before or the same as start date');
              return;
            }
            setEndDate(date);
          }}
          minDate={startDate}
          dateFormat="yyyy-MM-dd"
        />
      </div>

      <div>
        <table className="scheduled-events-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Event Title</th>
              <th>Event Description</th>
              <th>Time Slot</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookedEvents.map((event, index) => (
              <tr key={index}>
                <td>{event.date.toDate().toLocaleDateString()}</td> {/* Display the date as a string */}
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
              <div></div>
              <button
                className="reschedule-meeting-button"
                onClick={() => rescheduleMeeting(event)}
              >
                Reschedule Meeting
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
      <RescheduleMeetingModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        name={rescheduledPersonName}
      />
    </div>
  );
}

       
