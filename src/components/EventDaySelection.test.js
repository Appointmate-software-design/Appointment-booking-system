// Import required modules and components
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EventDaySelection from './EventDaySelection';
import DatePicker from "react-datepicker";

// Mock the DatePicker component to simplify testing
jest.mock('react-datepicker', () => {
  return function MockDatePicker(props) {
    return (
      // Return a simple input component instead of the actual DatePicker component
      <input
        type="text"
        value={props.selected?.toISOString().substring(0, 10)}
        onClick={() => props.onChange(new Date('2023-05-01'))}
      />
    );
  };
});

// Create a test suite for the EventDaySelection component
describe('EventDaySelection', () => {
  // Define variables to be used in the test cases
  const handleSelectDay = jest.fn();
  const selectedDate = new Date('2023-05-01');
  const startDate = new Date('2023-04-25');
  const endDate = new Date('2023-06-01');

  // Test that the component renders without crashing
  it('renders EventDaySelection component without crashing', () => {
    render(<EventDaySelection handleSelectDay={handleSelectDay} selectedDate={selectedDate} startDate={startDate} endDate={endDate} />);
  });

  // Test that the handleSelectDay function is called when a date is selected
  it('calls handleSelectDay function when a date is selected', () => {
    // Render the component
    render(<EventDaySelection handleSelectDay={handleSelectDay} selectedDate={selectedDate} startDate={startDate} endDate={endDate} />);
    // Get the input element
    const datepicker = screen.getByRole('textbox');
    // Simulate a click on the input element
    datepicker.click();
    // Check that the handleSelectDay function was called with the correct date
    expect(handleSelectDay).toHaveBeenCalledWith(new Date('2023-05-01'));
  });

  // Test that the selected date is displayed correctly
  it('displays the selected date correctly', () => {
    // Render the component
    render(<EventDaySelection handleSelectDay={handleSelectDay} selectedDate={selectedDate} startDate={startDate} endDate={endDate} />);
    // Get the input element
    const datepicker = screen.getByRole('textbox');
    // Check that the input value matches the selected date
    expect(datepicker).toHaveValue('2023-05-01');
  });
});
