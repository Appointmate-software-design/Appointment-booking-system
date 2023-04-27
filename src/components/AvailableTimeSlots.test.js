import React, { useEffect } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AvailableTimeSlots from './AvailableTimeSlots';
const { calculateTimeSlots } = AvailableTimeSlots;

jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    useEffect: jest.fn(),
  };
});

const setup = (overrides) => {
  const defaultProps = {
    host: 'John Doe',
    title: 'Test Meeting',
    description: 'This is a test meeting.',
    date: '2023-04-30',
    startTime: '9:00',
    endTime: '17:00',
    duration: 60,
    handleSlotChange: jest.fn(),
    bookedSlots: [],
    setBookedSlots: jest.fn(),
    availableSlots: [],
    setAvailableSlots: jest.fn(),
    testLoading: false,
  };

  const props = { ...defaultProps, ...overrides };
  return render(<AvailableTimeSlots {...props} />);
};

describe('AvailableTimeSlots', () => {
  test('renders available time slots', () => {
    const handleSlotChange = jest.fn();

    setup({
      availableSlots: [
        { start: '9:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
      ],
      handleSlotChange,
    });

    expect(screen.getByText('9:00-10:00')).toBeInTheDocument();
    expect(screen.getByText('10:00-11:00')).toBeInTheDocument();

    const checkbox = screen.getByTestId('slot-9-00-10-00');
    fireEvent.click(checkbox);
    expect(handleSlotChange).toHaveBeenCalled();
  });

  test('renders no available slots', () => {
    setup({
      availableSlots: [],
    });

    expect(screen.queryByText('9:00-10:00')).not.toBeInTheDocument();
    expect(screen.queryByText('10:00-11:00')).not.toBeInTheDocument();
  });

  test('renders loading state', () => {
    setup({
      testLoading: true,
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('useEffect is mocked', () => {
    expect(jest.isMockFunction(useEffect)).toBe(true);
  });

  describe('calculateTimeSlots', () => {
    test('returns correct time slots', () => {
      const startTime = '9:00';
      const endTime = '12:00';
      const duration = 60;
  
      const expectedTimeSlots = [
        { start: '9:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
      ];
  
      const timeSlots = calculateTimeSlots(startTime, endTime, duration);
  
      expect(timeSlots).toEqual(expectedTimeSlots);
    });
  
    test('returns empty array when start time is equal to end time', () => {
      const startTime = '9:00';
      const endTime = '9:00';
      const duration = 60;
  
      const timeSlots = calculateTimeSlots(startTime, endTime, duration);
  
      expect(timeSlots).toEqual([]);
    });
  
    test('returns empty array when start time is greater than end time', () => {
      const startTime = '12:00';
      const endTime = '9:00';
      const duration = 60;
  
      const timeSlots = calculateTimeSlots(startTime, endTime, duration);
  
      expect(timeSlots).toEqual([]);
    });
  
    test('returns correct time slots with different duration', () => {
      const startTime = '9:00';
      const endTime = '12:00';
      const duration = 90;
  
      const expectedTimeSlots = [
        { start: '9:00', end: '10:30' },
        { start: '10:30', end: '12:00' },
      ];
  
      const timeSlots = calculateTimeSlots(startTime, endTime, duration);
  
      expect(timeSlots).toEqual(expectedTimeSlots);
    });
  });
});
