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
        if (startTime >= endTime) {
          alert(`Invalid time range selected for ${day}. Start time must be earlier than end time.`);
          return;
        }
        checkedDays.push([day, startTime, endTime]);
      }
    });
  
    if (!document.querySelector('#title').value) {
      alert('Please enter a title for the event.');
      return;
    }
  
    const startDate = new Date(document.querySelector('input[name="start-date"]').value);
    const endDate = new Date(document.querySelector('input[name="end-date"]').value);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) {
      alert('Invalid date range selected. Please select valid start and end dates.');
      return;
    }
  
    const formData = {
      title: document.querySelector('#title').value,
      description: document.querySelector('#description').value,
      host: currentUser.uid,
      duration: document.querySelector('#duration').value,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      checkedDays: checkedDays
    };
  
    // submit form data to the database
    addDoc(eventsCollectionRef,formData).then(response => {
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










