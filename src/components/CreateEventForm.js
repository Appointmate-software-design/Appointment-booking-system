import React, {useState} from 'react';
import './CreateEventForm.css';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';



export default function CreateEventForm() {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = Array.from({ length: 13 }, (_, i) => `${i + 6}:00`); // hours can only be from 6:00 am to 
  const {currentUser} = useAuth();
  const eventsCollectionRef = collection(db,"events");
  const navigate = useNavigate();
  // Initialize state for start/end time validation
  const [validStartEndTimes, setValidStartEndTimes] = useState(true);


  function handleSubmit(event) {
    event.preventDefault();
  
    const checkedDays = [];
    daysOfWeek.forEach((day) => {
      const checkbox = document.getElementById(day.toLowerCase());
      if (checkbox.checked) {
        const startTime = document.getElementById(`${day.toLowerCase()}-start-time`).value;
        const endTime = document.getElementById(`${day.toLowerCase()}-end-time`).value;
        
        checkedDays.push({day, startTime, endTime}); // checked day has day e.g Monday, a startTime and an endTime
      }

    });
  
    
    const startDateInput = document.querySelector('input[name="start-date"]');
    const endDateInput = document.querySelector('input[name="end-date"]');
    const startDateString = startDateInput.value;
    const endDateString = endDateInput.value;
    //validation 

    if (!startDateString || !endDateString) {
      alert('Please fill in both start and end dates');
      return;
    }

    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert('Please enter valid date strings in the format YYYY-MM-DD');
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

    function timeToMinutes(timeString) {
      const [hours, minutes] = timeString.split(':').map(Number);
      return hours * 60 + minutes;
    }
    

    // Form validation
    if (formData.title === '') {
      alert('Please fill in title field');
    } else if (formData.description === '') {
      alert('Please fill in description field');
    } else if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert('Please enter a valid date range');
    } else if (formData.checkedDays.length === 0) {
      alert('No days have been checked');
    } else if (formData.checkedDays.some((day) => timeToMinutes(day.startTime) >= timeToMinutes(day.endTime))
    ){
      alert('Please select valid start times and end times');
    } else {
      // Submit form data
      addDoc(eventsCollectionRef, formData)
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error.message)
        });
        // once we have clicked submit, and the form is validated correctly and the data is submitted
      // we should be taken back to the home page
      navigate('/')
    }
    
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
        {daysOfWeek.map((day) => ( //for each day, create a check box, a select for start time and a select for end time
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
        <button onClick={handleSubmit}>Submit</button> <button onClick={() => {navigate('/')}}>Close</button> {/*if you click close, you will be navigated back to home*/}

      </div>
    </form>
  );
}