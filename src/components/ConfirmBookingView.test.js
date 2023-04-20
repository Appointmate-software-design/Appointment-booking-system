import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ConfirmBookingView from './ConfirmBookingView';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Mock data for the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    eventId: '123',
  }),
}));

// Mock data for the useDocumentData hook
// Mock data for the useDocumentData hook
jest.mock('react-firebase-hooks/firestore', () => ({
    useDocumentData: () => [
      {
        title: 'Test Event',
        description: 'Test Description',
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        duration: 30,
        checkedDays: [
          {
            day: 'Monday',
            startTime: '06:00',
            endTime: '18:00',
          },
          {
            day: 'Tuesday',
            startTime: '06:00',
            endTime: '18:00',
          },
          {
            day: 'Wednesday',
            startTime: '06:00',
            endTime: '18:00',
          },
          {
            day: 'Thursday',
            startTime: '06:00',
            endTime: '18:00',
          },
          {
            day: 'Friday',
            startTime: '06:00',
            endTime: '18:00',
          },
        ],
      },
      false,
      null,
    ],
  }));
  

describe('ConfirmBookingView', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <Router>
        <ConfirmBookingView />
      </Router>
    );
    expect(getByText('Meeting Details:')).toBeInTheDocument();
  });

  it('renders the correct information', () => {
    const { getByText } = render(
      <Router>
        <ConfirmBookingView />
      </Router>
    );
    expect(getByText('Title: Test Event')).toBeInTheDocument();
    expect(getByText('Description: Test Description')).toBeInTheDocument();
    expect(getByText('The duration of each slot is 30 minutes')).toBeInTheDocument();
  });

  it('displays an error message when selecting an unavailable day', async () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <ConfirmBookingView />
      </Router>
    );

    fireEvent.click(getByLabelText('next month'));
    fireEvent.click(getByText('1')); // Select a day that is not in the available days (e.g., Sunday)

    await waitFor(() => {
      expect(getByText('The day selected is not in the meeting schedule')).toBeInTheDocument();
    });
  });

  it('displays available time slots when selecting an available day', async () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <ConfirmBookingView />
      </Router>
    );

    fireEvent.click(getByLabelText('next month'));
    fireEvent.click(getByText('2')); // Select a day that is in the available days (e.g., Monday)

    await waitFor(() => {
      expect(getByText('09:00-09:30')).toBeInTheDocument();
      expect(getByText('09:30-10:00')).toBeInTheDocument();
      // ... Add more time slots here, if necessary
    });
  });
});
