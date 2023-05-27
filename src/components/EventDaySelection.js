import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import'./ConfirmBooking.css'

//this file handles our datepicker, on the confirmation booking page
// when someone selects a a date to book 

export default function EventDaySelection({ handleSelectDay, selectedDate, startDate, endDate, minDate, maxDate }) {
    return (
        <div>
            <DatePicker className = 'datePicker'
                selected={selectedDate}
                onChange={handleSelectDay}
                minDate={startDate}
                maxDate={endDate}
                aria-label="date-picker" // Add this line
            // excludeDates={excludedDates}
            />
        </div>
    )
}
