import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateEventForm from './CreateEventForm';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MemoryRouter } from "react-router-dom";
//mock the auth context, user
jest.mock('../contexts/AuthContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));




describe('CreateEventForm', () => {
  let alertSpy;

  beforeEach(() => { //create mock user
    useAuth.mockReturnValue({
      currentUser: {
        uid: '12345',
      },
    });
    useNavigate.mockReturnValue(jest.fn());

    // Mock window.alert
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(jest.fn());
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  //test to see the rendering of the form with all inputs

  test('renders the form with all inputs', () => {
    render(
      <MemoryRouter>
        <CreateEventForm />
      </MemoryRouter>
    );


    expect(screen.getByLabelText('Title:')).toBeInTheDocument();
    expect(screen.getByLabelText('Description:')).toBeInTheDocument();
    expect(screen.getByLabelText('Duration:')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date:')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  test('validates form fields', async () => {
    const { container } =     render(
      <MemoryRouter>
        <CreateEventForm />
      </MemoryRouter>
    );
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    // Click the submit button with empty fields
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Please fill in both start and end dates');
    });

    // Fill in the required fields and click the submit button
    userEvent.type(screen.getByLabelText('Title:'), 'Test Event');
    userEvent.type(screen.getByLabelText('Description:'), 'Test Description');
    userEvent.selectOptions(screen.getByLabelText('Duration:'), '30');
    fireEvent.change(container.querySelector('input[name="start-date"]'), {
      target: { value: '2023-05-01' },
    });
    fireEvent.change(container.querySelector('input[name="end-date"]'), {
      target: { value: '2023-04-30' },
    });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Please fill in title field');
    });

    // Set valid date range and click the submit button
    fireEvent.change(container.querySelector('input[name="end-date"]'), {
      target: { value: '2023-05-02' },
    });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Please fill in both start and end dates');
    });

    // Check a day and set invalid times
    fireEvent.click(screen.getByLabelText('Monday'));
    fireEvent.change(container.querySelector('#monday-start-time'), {
      target: { value: '17:00' },
    });
    fireEvent.change(container.querySelector('#monday-end-time'), {
      target: { value: '16:00' },
    });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Please fill in both start and end dates');
    });
  });
//test navigation of close button 
  test('navigate on close button click', () => {
    const navigate = useNavigate();
    render(
      <MemoryRouter>
        <CreateEventForm />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(navigate).toHaveBeenCalledWith('/');
  });
});
