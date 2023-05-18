// Import necessary libraries and components
import React, { useEffect, useState } from 'react';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import moment from 'moment';
import { ClipLoader } from 'react-spinners'; // Import ClipLoader for the loading spinner

const calculateTimeSlots = (startTime, endTime, duration) => {
  const timeSlots = []; // Initialize an array to store time slots
  const start = moment(startTime, 'H:mm');
  const end = moment(endTime, 'H:mm');

  // Calculate time slots and add them to the array
  while (start < end) {
    const slotEnd = moment.min(moment(start).add(duration, 'minutes'), end);
    timeSlots.push({
      start: start.format('H:mm'),
      end: slotEnd.format('H:mm'),
    });
    start.add(duration, 'minutes');
  }

  return timeSlots; // Return the time slots array
};

// AvailableTimeSlots component checks the database to ensure that booked slots do not appear,
// i.e meetings cannot clash
const AvailableTimeSlots = ({
  host,
  title,
  description,
  date,
  startTime,
  endTime,
  duration,
  handleSlotChange,
  bookedSlots,
  setBookedSlots,
  availableSlots, 
  setAvailableSlots,
  testLoading, // Add testLoading prop
}) => {
  // Declare and initialize loading state
  const [loading, setLoading] = useState(testLoading !== undefined ? testLoading : true); // Use testLoading if provided

  // useEffect hook to fetch booked slots when the component is mounted or when any dependency changes
  useEffect(() => {
    // Async function to fetch booked slots from the database
    const fetchBookedSlots = async () => {
      setLoading(true); // Set loading state to true
      // Create a query to fetch booked events for the given host and date
      const q = query(
        collection(db, 'bookedEvents'),
        where('host', '==', host),
        where('date', '==', date)
        
      );
      console.log(date)
      const querySnapshot = await getDocs(q); // Execute the query and store the result
  
      const bookedSlotsArray = []; // Initialize an array to store booked slots
      querySnapshot.forEach((doc) => {
        bookedSlotsArray.push(doc.data().timeSlot); // Add timeSlot to the array
      });
  
      setBookedSlots(bookedSlotsArray); // Update the bookedSlots state
  
      // Calculate and update the available slots
      const filteredSlots = calculateTimeSlots(startTime, endTime, duration).filter(
        (slot) => !bookedSlotsArray.includes(`${slot.start}-${slot.end}`)
      );
      setAvailableSlots(filteredSlots); // Update the availableSlots state
  
      setLoading(false); // Set loading state to false
    };
  
    fetchBookedSlots(); // Call fetchBookedSlots function
  }, [host, title, description, date, startTime, endTime, duration, setAvailableSlots]);
  
  // Function to calculate available time slots based on start time, end time, and duration
  

  // Display a loading spinner if loading is true
  if (loading) {
    return (
      <>
        <div className="loading">
          <ClipLoader size={60} color="#123abc" loading={loading} />
          <p>Loading...</p>
        </div>
      </>
    );
  }

  // Display the available time slots
  return (
    <>
      {availableSlots.map((slot) => (
        <div key={`${slot.start}-${slot.end}`} style={{ marginTop: '10px', marginLeft: '10px' }}>
          <input
            data-testid={`slot-${slot.start.replace(':', '-')}-${slot.end.replace(':', '-')}`}
            type="checkbox"
            id={`${slot.start}-${slot.end}`}
            name={`${slot.start}-${slot.end}`}
            value={`${slot.start}-${slot.end}`}
            onChange={handleSlotChange}
          />

          <label htmlFor={`${slot.start}-${slot.end}`} style={{ marginLeft: '5px' }}>
            {slot.start}-{slot.end}
          </label>
        </div>
      ))}
    </>
  );
};
AvailableTimeSlots.calculateTimeSlots = calculateTimeSlots;

// Export the AvailableTimeSlots component for use in other files
export default AvailableTimeSlots;

