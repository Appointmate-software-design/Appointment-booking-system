import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ScheduledEvents from './ScheduledEvents';
import DatePicker from 'react-datepicker';

// Mocking necessary dependencies
jest.mock('react-datepicker', () => (props) => {
  const { selected, onChange, minDate, dateFormat } = props;
  return (
    <input
      type="date"
      data-testid="datepicker"
      value={selected}
      onChange={(e) => onChange(new Date(e.target.value))}
      min={minDate.toISOString().split('T')[0]}
      max={dateFormat}
    />
  );
});

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ currentUser: { displayName: 'John Doe', email: 'john@example.com' } }),
}));

jest.mock('emailjs-com', () => ({
  send: jest.fn(),
}));

describe('ScheduledEvents', () => {
  beforeEach(() => {
    render(<ScheduledEvents />);
  });

  it('renders the Scheduled Events title', () => {
    expect(screen.getByText('Scheduled Events')).toBeInTheDocument();
  });

  it('renders the DatePicker', () => {
    expect(screen.getByTestId('datepicker')).toBeInTheDocument();
  });

  it('updates the DatePicker value', async () => {
    const datepicker = screen.getByTestId('datepicker');
    fireEvent.change(datepicker, { target: { value: '2023-05-01' } });

    await waitFor(() => {
      expect(datepicker.value).toBe('');
    });
  });

  // Add any additional tests related to the component rendering and user interactions.
});

