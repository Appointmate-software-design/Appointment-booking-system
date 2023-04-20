import React, { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc,addDoc, collection } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import EventDaySelection from "./EventDaySelection";
import { ClipLoader } from 'react-spinners'; //for the loading spinner
import Title from './Title'; // title should be on every page
import moment from 'moment';

export default function ConfirmBookingView() {
  const { eventId } = useParams();
  const documentRef = doc(db, "events", eventId); // Create a Document Reference object
  const [event, loading, error] = useDocumentData(documentRef);
  const [selectedDate, setSelectedDay] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const handleSelectDay = (date) => {
    setSelectedDay(date);
  };
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const availableTimes = selectedDate && event?.checkedDays.find(({day})=>{ // need to see if the day selected is a checked day before we show slots
    return day === daysOfWeek[selectedDate.getDay()]
  })
  console.log({availableTimes})


    //Given the start time, end time and duration of the event, calculate the time slots that must appear
    const calculateTimeSlots = (startTime, endTime, duration) => {
      const timeSlots = [];
      const start = moment(startTime, "H:mm");
      const end = moment(endTime, "H:mm");
      
      while (start < end) {
        const slotEnd = moment.min(moment(start).add(duration, "minutes"), end);
        timeSlots.push({
          start: start.format("H:mm"),
          end: slotEnd.format("H:mm")
        });
        start.add(duration, "minutes");
      }
      
      return timeSlots;
    }

    //check if loading, if it is, then show loading symbol


  if (loading) {
    return <>
      <div className="loading">
        <ClipLoader size={60} color="#123abc" loading={loading} />
        <p>Loading...</p>
      </div>
    </>
  }
  if (!event) {
    return <p>there was an error getting event</p>;
  }

  const PopupMessage = ({ message }) => {
    const [visible, setVisible] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
  
      return () => {
        clearTimeout(timer);
      };
    }, []);
  
    return visible ? (
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          backgroundColor: "teal",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          zIndex: "9999"
        }}
      >
        {message}
      </div>
    ) : null;
  };

  const handleConfirmBooking = async () => {
    // Get user details from input fields
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex pattern for email validation
    if (!email.match(emailPattern)) {
      // Check if email is in the correct format
      alert("Email is not in the correct format");
      return; // Return early if email is not valid
    }
  
    // Name validation
    if (!name || typeof name !== "string") {
      // Check if name is empty or not a string
      alert("Name is required and should be a string");
      return; // Return early if name is not valid
    }else if (!/^[a-zA-Z]+$/.test(name)) {
        // Check if name contains only alphabets
        alert("Name should contain only alphabets");
        return; // Return early if name is not valid
    }
  

    
    // Get selected time slots
    const selectedSlots = document.querySelectorAll('input[type="checkbox"]:checked');
    const bookedSlots = [];
    selectedSlots.forEach(slot => {
      bookedSlots.push(slot.value);
    });

    const booking = {
      email,
      name,
      selectedDate : moment(selectedDate).format("YYYY-MM-DD"),
      bookedSlots,
      eventName: event.title
    };

    try {
      // Add booking information to Firebase collection
      const bookingRef = await addDoc(collection(db, "bookings"), booking);
      console.log("Booking added with ID: ", bookingRef.id);
      // Do something after successful booking confirmation
      document.getElementById("email").value = ""; //clears the email field after successful booking
      document.getElementById("name").value = ""; //clears the name field after successful booking
      //setSelectedDay(null);                     // clears the selectedDay field after successful booking
      setBookingStatus("success");
      
      selectedSlots.forEach(slot => {
        slot.checked = false;                    // unchecks the selected time slot after successful booking
      });
    } catch (error) {
      console.error("Error adding booking: ", error);
    }
  };
  return (
    <div>
      <Title/>
      <h2>Meeting Details:</h2>
      <div>Title: {event.title} </div>
      <div>Description: {event.description} </div>
      <div>The duration of each slot is {event.duration} minutes</div>
      <label>
        <h5>Enter your details: </h5>
        <span>Email:</span>
        <input type="text" id="email" />
      </label>
      <label>
        <span>Name:</span>
        <input type="text" id="name" />
      </label>
      {/* { event.duration} 
      {event.checkedDays.startTime} */}
      <p>Please select a day from the box below:</p>
      <EventDaySelection
        handleSelectDay={handleSelectDay}
        selectedDate={selectedDate}
        startDate={new Date(event.startDate)}
        endDate={new Date(event.endDate)}
      />
{/* if a day is selected, check if it is in the meeting schedule, if it is then show the relevant time slots, otherwise say "The day selected is not in the meeting schedule"  */}
      {selectedDate && availableTimes && calculateTimeSlots(availableTimes.startTime, availableTimes.endTime, event.duration).length > 0 ? (
        calculateTimeSlots(availableTimes.startTime, availableTimes.endTime, event.duration).map((slot) => (
          <div key={`${slot.start}-${slot.end}`} style={{ marginTop: "10px", marginLeft: "10px" }}>
            <input type="checkbox" id={`${slot.start}-${slot.end}`} name={`${slot.start}-${slot.end}`} value={`${slot.start}-${slot.end}`}  />
            <label htmlFor={`${slot.start}-${slot.end}`} style={{ marginLeft: "5px" }}>
              {slot.start}-{slot.end}
            </label>
          </div>
        ))
      
      ) : (
        selectedDate && <p>The day selected is not in the meeting schedule</p>
      )}

        {selectedDate && availableTimes && <button style={{backgroundColor: 'teal', color: 'white', borderRadius: '5px', marginTop: '10px', marginLeft: '10px'}}onClick={handleConfirmBooking}>Confirm booking</button>
}
      

        {!selectedDate && 
        <p>no date selected</p>}
     {bookingStatus ==="success" && (
      <PopupMessage message="Booking successful!" />
      )}
    </div>
  );

  
}
