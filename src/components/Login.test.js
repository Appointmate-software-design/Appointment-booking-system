// Importing necessary modules
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import { useAuth } from '../contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock useAuth hook and navigate function
jest.mock('../contexts/AuthContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Test cases for Login component
describe('Login component', () => {
  beforeEach(() => {
    // Mocking the useAuth hook
    useAuth.mockReturnValue({
      login: jest.fn(),
      currentUser: null,
    });
  });

  // Test case to check if the form renders properly
  test('renders form with Email and Password fields', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  // Test case to check if an error is displayed when the login fails
  test('displays error when login fails', async () => {
    const mockLogin = useAuth().login;
    mockLogin.mockRejectedValue({ code: 'auth/wrong-password' });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong-password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() =>
      expect(screen.getByText('password is incorrect')).toBeInTheDocument()
    );
  });

  // Add more test cases for successful login, invalid email, etc.
});
