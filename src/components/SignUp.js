// Importing necessary modules
import React, { useRef, useState } from 'react';
import { Card, Form, Button, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Title from './Title';

// Sign up component
export default function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handles form submission
  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match');
    }
    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate('/'); // Redirects to home page after a successful sign up
    } catch (error) {
      console.log(error.code);
      if (error.code === 'auth/invalid-email') {
        // Show an error message for invalid email
        setError('Please enter a valid email address');
      } else if (error.code === 'auth/wrong-password') {
        // Show an error message for wrong password
        setError('Incorrect password, please try again');
      } else if (error.code === 'auth/weak-password') {
        setError('Password must contain at least 6 characters');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else {
        setError('An error occured, please try again');
      }
    }
    setLoading(false);
  }

  // Renders the component
  return (
    <>
      <Title />
      <Container className="d-flex align-Items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="w-100 mt-5" style={{ maxWidth: '400px' }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="emailFormGroup">
                  <Form.Label htmlFor="email">Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} id="email"></Form.Control>
                </Form.Group>
                <Form.Group controlId="passwordFormGroup">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} id="password"></Form.Control>
                </Form.Group>
                <Form.Group controlId="passwordConfirmFormGroup">
                  <Form.Label htmlFor="password-confirm">Password Confirmation</Form.Label>
                  <Form.Control type="password" ref={passwordConfirmRef} id="password-confirm"></Form.Control>
                </Form.Group>
                <Button disabled={loading} className="w-100 mt-3" type="submit">
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2" style={{ color: 'blue' }}>
            Already have an Account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </Container>
    </>
  );
}
