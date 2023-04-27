import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './Home';
import { AuthContext } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { jest } from '@jest/globals';
import ScheduledEvents from './ScheduledEvents';
import EventList from './EventList';


jest.mock('./ScheduledEvents', () => () => <div>ScheduledEvents</div>);
jest.mock('./EventList', () => () => <div>EventList</div>);


const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AuthContext.Provider {...providerProps}>{ui}</AuthContext.Provider>,
    renderOptions
  );
};

test('renders Home component with correct buttons', () => {
  const providerProps = {
    value: {
      currentUser: { email: 'testuser@example.com' },
    },
  };
  customRender(
    <BrowserRouter>
      <Home />
    </BrowserRouter>,
    { providerProps }
  );

  expect(screen.getByText(/Welcome testuser@example.com/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Events/i)).toHaveLength(2);
  expect(screen.getByText(/Scheduled Events/i)).toBeInTheDocument();
  expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
});

test('switches between Events and Scheduled Events when buttons are clicked', () => {
  const providerProps = {
    value: {
      currentUser: { email: 'testuser@example.com' },
    },
  };
  customRender(
    <BrowserRouter>
      <Home />
    </BrowserRouter>,
    { providerProps }
  );

  const [eventsButton, scheduledEventsButton] = screen.getAllByText(/Events/i);

  fireEvent.click(scheduledEventsButton);
  expect(screen.getByText(/ScheduledEvents/i)).toBeInTheDocument();

  fireEvent.click(eventsButton);
  expect(screen.getByText(/EventList/i)).toBeInTheDocument();
});

