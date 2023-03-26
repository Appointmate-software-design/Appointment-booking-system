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

    const formData = {
    title: document.querySelector('#title').value,
    description: document.querySelector('#description').value,
    host: currentUser.uid,
      duration: document.querySelector('#duration').value,
      startDate: document.querySelector('input[name="start-date"]').value,
      endDate: document.querySelector('input[name="end-date"]').value,
      checkedDays: checkedDays
    };

    //validation here, before submitting to the database.
    //make sure all things that can be submitted make sense
    //there must be a title,description date selection must make sense, time selection must make sense - no wierd dates that go back in time, same is true for hours
    //hours cannot be the same eg 7:00-7:00
    //alert the user about these things
    //only once all validation has occured, submit it to the database.

    ///submition to the database
    addDoc(eventsCollectionRef,formData).then(response => {
      console.log(response)
    }).catch(error => {
      console.log(error.message)
    })


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










