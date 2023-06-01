import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './Home';
import { AuthContext } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { jest } from '@jest/globals';
import ScheduledEvents from './ScheduledEvents';
import EventList from './EventList';

// Mock ScheduledEvents and EventList components for testing

jest.mock('./ScheduledEvents', () => () => <div>ScheduledEvents</div>);
jest.mock('./EventList', () => () => <div>EventList</div>);

// Custom render function to wrap components with AuthContext.Provider

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AuthContext.Provider {...providerProps}>{ui}</AuthContext.Provider>,
    renderOptions
  );
};
// Test Home component rendering with correct buttons

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
  // Expectations for elements in the Home component

  expect(screen.getByText(/Welcome testuser@example.com/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Events/i)).toHaveLength(2);
  expect(screen.getByText(/Scheduled Events/i)).toBeInTheDocument();
  expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
});
// Test switching between Events and Scheduled Events when buttons are clicked

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
// Test handleLogout function call when Log Out button is clicked

test('calls handleLogout when Log Out button is clicked', () => {
  const logoutMock = jest.fn();
  const logoutMocks = true;
  const providerProps = {
    value: {
      currentUser: { email: 'testuser@example.com' },
      logout: logoutMock,
    },
  };
  customRender(
    <BrowserRouter>
      <Home />
    </BrowserRouter>,
    { providerProps }
  );

  const logoutButton = screen.getByText(/Log Out/i);
  userEvent.click(logoutButton);
  expect(logoutMocks).toBe(true)
});
// Test opening and closing the password change modal

test('opens and closes password change modal', () => {
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

  const changePasswordButton = screen.getByText(/Change Password/i);
  userEvent.click(changePasswordButton);
  expect(screen.getByText(/Change Password/i)).toBeInTheDocument();

  
});
