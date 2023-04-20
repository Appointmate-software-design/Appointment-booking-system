import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ConfirmBookingView from './ConfirmBookingView';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock data for the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    eventId: '123',
  }),
}));

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
          startTime: '09:00',
          endTime: '17:00',
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

  // Add more test cases here
});
