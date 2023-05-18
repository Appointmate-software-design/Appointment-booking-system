import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ScheduledEvents from './ScheduledEvents';
import { useAuth } from '../contexts/AuthContext';

//mocks the user and signup and login components
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { uid: '123', displayName: 'John Doe', email: 'john@example.com' },
    signup: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

describe('ScheduledEvents', () => {

  let bookedEvents;

  beforeEach(() => {
    bookedEvents = [
    ];
    render(<ScheduledEvents />);
  });
//test the rendering of the title
  it('renders the Scheduled Events title', () => {
    const titleElement = screen.getByText(/Scheduled Events/i);
    expect(titleElement).toBeInTheDocument();
  });
//test the rendering of the date picker
  it('renders the DatePicker', () => {
    const datePickerElement = screen.getByText(/Please select a date range:/i);
    expect(datePickerElement).toBeInTheDocument();
  });
//test the rendering of the cancel meeting button
  it('renders the Cancel Meeting button if events are present', () => {
    const cancelButton = screen.queryByText('Cancel Meeting');
    if (bookedEvents.length > 0) {
      expect(cancelButton).toBeInTheDocument();
    } else {
      expect(cancelButton).not.toBeInTheDocument();
    }
  });
  //test the rendering of the reschedule meeting button
  it('renders the Reschedule Meeting button if events are present', () => {
    const rescheduleButton = screen.queryByText('Reschedule Meeting');
    if (bookedEvents.length > 0) {
      expect(rescheduleButton).toBeInTheDocument();
    } else {
      expect(rescheduleButton).not.toBeInTheDocument();
    }
  });
});

