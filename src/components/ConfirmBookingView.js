import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../firebase";
import EventDaySelection from "./EventDaySelection";
import { ClipLoader } from 'react-spinners'; //for the loading spinner
import Title from './Title'; // title should be on every page
import moment from 'moment';
import { useAuth } from "../contexts/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import ThankYouModal from "./ThankYouModal";
import AvailableTimeSlots from './AvailableTimeSlots'; // check for booked time slots so that meetings cannot clash
import emailjs from "emailjs-com";


export default function ConfirmBookingView() {
  const { eventId } = useParams();
  const documentRef = doc(db, "events", eventId); // Create a Document Reference object
  const [event, loading, error] = useDocumentData(documentRef);
  const [selectedSlots, setSelectedSlots] = useState([]); //to store the selected time slots.
  const [selectedDate, setSelectedDay] = useState(null);
  const { currentUser } = useAuth(); //host of the event
  const [isModalOpen, setIsModalOpen] = useState(false);//ThankYou modal state
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);


  const handleSelectDay = (date) => {
    setSelectedDay(date);
  };
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const availableTimes = selectedDate && event?.checkedDays.find(({day})=>{ // need to see if the day selected is a checked day before we show slots
    return day === daysOfWeek[selectedDate.getDay()]
  })


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

  //function to handle slot change
  const handleSlotChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setSelectedSlots((prev) => [...prev, name]);
    } else {
      setSelectedSlots((prev) => prev.filter((slot) => slot !== name));
    }
  };

  const handleConfirmBooking = () => {
    const emailInput = document.getElementById("email").value;
    const nameInput = document.getElementById("name").value;
  
    // Check if email or name is empty
    if (!emailInput) {
      alert("Please enter your email.");
      return;
    }
    if (!nameInput) {
      alert("Please enter your name.");
      return;
    }
  
    if (selectedSlots.length === 0) {
      alert("Please select at least one slot.");
    } else {
      // Get available slots from the AvailableTimeSlots component
      const availableSlots = availableTimes && calculateTimeSlots(availableTimes.startTime, availableTimes.endTime, event.duration)
        .filter((slot) => !bookedSlots.includes(`${slot.start}-${slot.end}`));
      
      // Save only available slots
      const slotsToSave = selectedSlots.filter((slot) => availableSlots.some((availableSlot) => `${availableSlot.start}-${availableSlot.end}` === slot));
      
      slotsToSave.forEach((slot) => {
        saveBooking(slot, selectedDate, nameInput, emailInput, currentUser.uid);
      });
      setIsModalOpen(true);
      setSelectedSlots([]); // Clear the selectedSlots state after the booking process
    }      
    
    
  };
  
  
  
  const saveBooking = async (timeSlot, date, name, email, host) => { //function to save booking into the database
    try {
      await addDoc(collection(db, "bookedEvents"), {
        timeSlot,
        date,
        name,
        email,
        host,
        title: event.title,
        description: event.description
      });
      

      emailjs.send(
        "service_kd1nbnm",
        "template_1e2c8el",
        {
          to_email: email,
          name: name,
          date: selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
          timeSlot: timeSlot,
          eventTitle: event.title,
          eventDescription: event.description,
          hostName: currentUser.displayName || currentUser.email,
        },
        "-U8Z9iJC2NXirC-38"
        
      );
      
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
{/*The AvailableTimeSlots component also checks if the time slot has been booked before displaying it */}
  {selectedDate && availableTimes ? (
    <AvailableTimeSlots
    host={event.host}
    title={event.title}
    description={event.description}
    date={selectedDate}
    startTime={availableTimes.startTime}
    endTime={availableTimes.endTime}
    duration={event.duration}
    handleSlotChange={handleSlotChange}
    bookedSlots={bookedSlots}
    setBookedSlots={setBookedSlots}
    availableSlots={availableSlots} 
    setAvailableSlots={setAvailableSlots} 
  />
  
  ) : (
    selectedDate && <p>The day selected is not in the meeting schedule</p>
  )}


{selectedDate && availableTimes && (
  availableSlots.length > 0 ? (
    <button
      style={{
        backgroundColor: 'teal',
        color: 'white',
        borderRadius: '5px',
        marginTop: '10px',
        marginLeft: '10px',
      }}
      onClick={handleConfirmBooking}
    >
      Confirm booking
    </button>
  ) : (
    <p>No time slots left for this day.</p>
  )
)}

{/* Add the ThankYouModal component */}
<ThankYouModal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setSelectedDay(null);
  }}
  email={currentUser.email}
/>

      
//In addition to rendering the ThankYouModal component, the code also conditionally renders a message if no date has been selected.

        {!selectedDate && 
        <p>no date selected</p>}

    </div>
  );

  
}
