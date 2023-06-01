// Importing necessary modules
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUp from './SignUp';
import { useAuth } from '../contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock useAuth hook and navigate function
jest.mock('../contexts/AuthContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Test cases for SignUp component
describe('SignUp component', () => {
  beforeEach(() => {
    // Mocking the useAuth hook
    useAuth.mockReturnValue({
      signup: jest.fn(),
      currentUser: null,
    });
  });

  // Test case to check if the form renders properly
  test('renders form with Email, Password, and Password Confirmation fields', () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Password Confirmation')).toBeInTheDocument();
  });

  // Test case to check if an error is displayed when the passwords do not match
  test('displays error when passwords do not match', async () => {
    render(
      <Router>
        <SignUp />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Password Confirmation'), {
      target: { value: 'password321' },
    });

    fireEvent.click(screen.getByRole('button', { name: "Sign Up", type: "submit" }));

    await waitFor(() =>
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    );
  });

});
