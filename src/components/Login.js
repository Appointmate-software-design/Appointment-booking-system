// Import the necessary React components and hooks for the login form
import React, {useRef, useState } from 'react'
import {Card, Form, Button,Alert,Container } from 'react-bootstrap'
import{useAuth} from '../contexts/AuthContext'
import{Link, useNavigate} from 'react-router-dom';
import Title from './Title';

// Define a functional component for the login form
export default function Login() {

  // Define two "refs" using the "useRef" hook
  const emailRef = useRef()
  const passwordRef = useRef()

  // Define a navigation "hook" to handle page redirections
  const navigate = useNavigate()

  // Access the "authentication" context of the app using the "useAuth" hook
  const {login, currentUser} = useAuth()

  // Define two state variables using the "useState" hook
  const [error,setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Define an asynchronous function named "handleSubmit" that will handle the form submission event
  async function handleSubmit(e) {
    e.preventDefault()
    try { 
      // Clear any previous error messages and set loading state to true
      setError('')
      setLoading(true)

      // Attempt to log in using the email and password entered in the form
      await login(emailRef.current.value, passwordRef.current.value)

      // If the login was successful, redirect to the home page
      navigate('/')
    } catch (error) {
      // If there is an error, display an appropriate error message based on the error code returned by Firebase
      console.log(error.code)
      if(error.code === "auth/wrong-password"){
        setError("password is incorrect")
      } else if( error.code === "auth/user-not-found"){
        setError("user not found")
      }
    }
    // Set loading state to false after login attempt completes
    setLoading(false)
  }

  // Return a JSX element that will render the login form
  return (
    <>
      <Title/> {/* Render a component for the title of the login page */}
      <Container className="d-flex align-Items-center justify-content-center" style={{ minHeight: "100vh"}}>
        <div className="w-100 mt-5" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Log In</h2>
              {/* Display any error messages that may have occurred during login */}
              {error && <Alert variant='danger'>{error}</Alert>}
              {/* Define the login form with email and password input fields */}
              <Form onSubmit={handleSubmit}>
              <Form.Group controlId="emailFormGroup">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control type="email" ref={emailRef} id="email" required />
              </Form.Group>
              <Form.Group controlId="passwordFormGroup">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} id="password" required />
              </Form.Group>

                {/* Disable the login button while the login attempt is in progress */}
                <Button disabled={loading} className="w-100 mt-3" type="submit">Log In</Button>
              </Form>
            </Card.Body>
          </Card>
          {/* Display a link to the signup page */}
          <div className='w-100 text-center mt-2' style={{ color: 'blue' }}>
            Need an Account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </Container>
    </>
  )
}
