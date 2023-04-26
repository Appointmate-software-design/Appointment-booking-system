import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//this file handles our datepicker, on the confirmation booking page
// when someone selects a a date to book 

export default function EventDaySelection({ handleSelectDay, selectedDate, startDate, endDate, minDate, maxDate }) {
    return (
        <div>
            <DatePicker
                selected={selectedDate}
                onChange={handleSelectDay}
                minDate={startDate}
                maxDate={endDate}
            // excludeDates={excludedDates}
            />
        </div>
    )
}
