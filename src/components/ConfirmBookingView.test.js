// Import necessary dependencies and components
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmBookingView from './ConfirmBookingView';
import { useParams } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuth } from '../contexts/AuthContext';


// Mock necessary hooks and modules
// Mocks the 'useParams' hook from 'react-router-dom'
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));
// Mocks the 'useDocumentData' hook from 'react-firebase-hooks/firestore'
jest.mock('react-firebase-hooks/firestore', () => ({
  useDocumentData: jest.fn(),
}));
// Mocks the 'useAuth' hook from '../contexts/AuthContext'
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('react-datepicker', () => {
  return function MockDatePicker(props) {
    return (
      <input
        type="text"
        value={props.selected?.toISOString().substring(0, 10)}
        onClick={() => props.onChange(new Date('2023-01-01'))}
        aria-label="date-picker"
      />
    );
  };
});


// Mock data for the event and current user
const mockEvent = {
  title: 'Test Event',
  description: 'Test Event Description',
  duration: 30,
  startDate: '2023-01-01',
  endDate: '2023-01-31',
  checkedDays: [
    {
      day: 'Monday',
      startTime: '10:00',
      endTime: '17:00',
    },
  ],
};
//Mocking Current user assigned
const mockCurrentUser = {
  uid: 'test-user-id',
  email: 'test@test.com',
  displayName: 'Test User',
};

// Mock the return values for the hooks and components used in the component being tested
beforeEach(() => {
  // Mock the return value for the 'useParams' hook
  useParams.mockReturnValue({ eventId: 'test-event-id' });
  // Mock the return value for the 'useDocumentData' hook
  useDocumentData.mockReturnValue([mockEvent, false, null]);
  // Mock the return value for the 'useAuth' hook
  useAuth.mockReturnValue({ currentUser: mockCurrentUser });
});

// Start test suite for the 'ConfirmBookingView' component
describe('ConfirmBookingView', () => {
  // Test to check if the component renders event details
  it('renders event details', () => {
    render(<ConfirmBookingView />);
    expect(screen.getByText(/Meeting Details:/i)).toBeInTheDocument();
    expect(screen.getByText(/Title: Test Event/i)).toBeInTheDocument();
    expect(screen.getByText(/Description: Test Event Description/i)).toBeInTheDocument();
    expect(screen.getByText(/The duration of each slot is 30 minutes/i)).toBeInTheDocument();
  });

  // Test to check if the component renders email and name input fields
  it('renders email and name input fields', () => {
    render(<ConfirmBookingView />);
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
  });

  // Test to check if the component renders the 'EventDaySelection' component
  it('renders EventDaySelection component', () => {
    render(<ConfirmBookingView />);
    expect(screen.getByText(/Please select a day from the box below:/i)).toBeInTheDocument();
  });

    // Test to check if the component renders the "No date selected" message
    it('renders "No date selected" message', () => {
      render(<ConfirmBookingView />);
      expect(screen.getByText(/no date selected/i)).toBeInTheDocument();
    });
  
  // Test to check if the component updates the selected date
  it('updates selected date', async () => {
    render(<ConfirmBookingView />);
    const datePicker = screen.getByRole('textbox', { name: /date-picker/i });
    fireEvent.click(datePicker); // Click the mocked date picker input

    await waitFor(() => {
      expect(screen.getByText(/The day selected is not in the meeting schedule/i)).toBeInTheDocument();
    });
  });

  
});


