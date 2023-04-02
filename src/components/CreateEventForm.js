import React from 'react';
import './CreateEventForm.css';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';



export default function CreateEventForm({handleClose}) {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = Array.from({ length: 13 }, (_, i) => `${i + 6}:00`);
  const {currentUser} = useAuth();
  const eventsCollectionRef = collection(db,"events");

  function handleSubmit(event) {
    event.preventDefault();
  
    const checkedDays = [];
    daysOfWeek.forEach((day) => {
      const checkbox = document.getElementById(day.toLowerCase());
      if (checkbox.checked) {
        const startTime = document.getElementById(`${day.toLowerCase()}-start-time`).value;
        const endTime = document.getElementById(`${day.toLowerCase()}-end-time`).value;
        checkedDays.push([day, startTime, endTime]);
      }
    });
  
    const title = document.querySelector('#title').value;
    const description = document.querySelector('#description').value;
    const duration = document.querySelector('#duration').value;
    const startDate = document.querySelector('input[name="start-date"]').value;
    const endDate = document.querySelector('input[name="end-date"]').value;
  
    // Perform validation checks
    if (!title) {
      alert("Please enter a title for your event.");
      return;
    }
    if (!description) {
      alert("Please enter a description for your event.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert("End date cannot be earlier than start date.");
      return;
    }
  
    const selectedDays = checkedDays.map(([day, startTime, endTime]) => {
      const startDateTime = new Date(`${startDate} ${startTime}`);
      const endDateTime = new Date(`${endDate} ${endTime}`);
      if (endDateTime.getTime() <= startDateTime.getTime()) {
        alert(`Invalid time range selected for ${day}.`);
        return null;
      }
      const start = new Date(startDateTime.getTime());
      start.setDate(start.getDate() + (daysOfWeek.indexOf(day) - start.getDay() + 7) % 7);
      const end = new Date(endDateTime.getTime());
      end.setDate(end.getDate() + (daysOfWeek.indexOf(day) - end.getDay() + 7) % 7);
      if (end <= start) {
        alert(`Invalid time range selected for ${day}.`);
        return null;
      }
      return { day, startTime, endTime, start, end };
    }).filter((day) => day !== null);
  
    if (selectedDays.length === 0) {
      alert("Please select at least one day for your event.");
      return;
    }
  
    const formData = {
      title,
      description,
      host: currentUser.uid,
      duration,
      startDate,
      endDate,
      checkedDays: selectedDays
    };
  
    // Only submit the form if all validation checks have passed
    addDoc(eventsCollectionRef, formData).then(response => {
      console.log(response)
    }).catch(error => {
      console.log(error.message)
    });
  
    console.log(formData);
  }
  
  

  return (
    <form className="create-event-form">
      <label>
        <span>Title:</span>
        <input type="text" id="title" />
      </label>
      <label>
        <span>Description:</span>
        <textarea id="description" />
      </label>
      <label>
        <span>Duration:</span>
        <select id="duration" defaultValue="15">
          <option value="15">15</option>
          <option value="30">30</option>
        </select>
      </label>

      <label htmlFor="start-date">Start Date:</label>
      <input type="date" id="start-date" name="start-date" />

      <label htmlFor="end-date">End Date:</label>
      <input type="date" id="end-date" name="end-date" />

      <div>
        {daysOfWeek.map((day) => (
          <div key={day.toLowerCase()}>
            <input type="checkbox" id={day.toLowerCase()} name={day.toLowerCase()} />
            <label htmlFor={day.toLowerCase()}>{day}</label>
            <select id={`${day.toLowerCase()}-start-time`} name={`${day.toLowerCase()}-start-time`}>
              {hours.map((hour) => (
                <option key={`${day.toLowerCase()}-start-${hour}`} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            -
            <select id={`${day.toLowerCase()}-end-time`} name={`${day.toLowerCase()}-end-time`}>
              {hours.map((hour) => (
                <option key={`${day.toLowerCase()}-end-${hour}`} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>
        ))}
        <br />
        <button onClick={handleSubmit}>Submit</button> <button onClick={handleClose}>Close</button>

      </div>
    </form>
  );
}









