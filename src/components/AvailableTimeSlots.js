import React, { useEffect, useState } from 'react';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import moment from 'moment';
import { ClipLoader } from 'react-spinners'; 
/*for the loading spinner
ClipLoader is a React component that displays a loading animation using a rotating clip. 
It can be used to provide visual feedback to users while content is being loaded or processed.
*/

// this file checks the database to ensure that booked slots do not appear, i.e meetings cannot clash

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
  setAvailableSlots
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      setLoading(true);
      const q = query(
        collection(db, 'bookedEvents'),
        where('host', '==', host),
        where('date', '==', date)
      );
      const querySnapshot = await getDocs(q);
  
      const bookedSlotsArray = [];
      querySnapshot.forEach((doc) => {
        bookedSlotsArray.push(doc.data().timeSlot);
      });
  
      setBookedSlots(bookedSlotsArray);
  
      // Calculate and update the available slots
      const filteredSlots = calculateTimeSlots(startTime, endTime, duration).filter(
        (slot) => !bookedSlotsArray.includes(`${slot.start}-${slot.end}`)
      );
      setAvailableSlots(filteredSlots);
  
      setLoading(false);
    };
  
    fetchBookedSlots();
  }, [host, title, description, date, startTime, endTime, duration, setAvailableSlots]);
  
  const calculateTimeSlots = (startTime, endTime, duration) => {
    const timeSlots = [];
    const start = moment(startTime, 'H:mm');
    const end = moment(endTime, 'H:mm');

    while (start < end) {
      const slotEnd = moment.min(moment(start).add(duration, 'minutes'), end);
      timeSlots.push({
        start: start.format('H:mm'),
        end: slotEnd.format('H:mm'),
      });
      start.add(duration, 'minutes');
    }

    return timeSlots;
  };

 

  if (loading) {
    return <>
      <div className="loading">
        <ClipLoader size={60} color="#123abc" loading={loading} />
        <p>Loading...</p>
      </div>
    </>
  }


//This code returns a list of time slots as checkboxes.
  return (
    <>
      {availableSlots.map((slot) => (
        <div key={`${slot.start}-${slot.end}`} style={{ marginTop: '10px', marginLeft: '10px' }}>
          <input
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

export default AvailableTimeSlots;
