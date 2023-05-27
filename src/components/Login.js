// Import the necessary React components and hooks for the login form
import React, {useRef, useState } from 'react'
import {Alert} from 'react-bootstrap'
import{useAuth} from '../contexts/AuthContext'
import{Link, useNavigate} from 'react-router-dom';
import Title from './Title';
import './Login.css';

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
        <div className='container'>
              <h2 className="login-text">Log In</h2>
              {/* Display any error messages that may have occurred during login */}
              {error && <Alert variant='danger'>{error}</Alert>}
              {/* Define the login form with email and password input fields */}
              <div className='form-container'>
              <form className='login-form' onSubmit={handleSubmit}>
                <button className='google-login'
                  onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 1)')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 0.9)')}
                >
                  <span className='gIcon'>
                    <img className='google' src={process.env.PUBLIC_URL + '/google.svg'}></img>
                    Continue with Google
                  </span>
                </button>
                  <hr className='hr-text' data-content="OR"></hr>
                <input type="email" ref={emailRef} id="email" placeholder='Email address' required />
                <br></br>
                <input type="password" ref={passwordRef} id="password" placeholder='Password' required />
                <br></br>
                {/* Disable the login button while the login attempt is in progress */}
                <button disabled={loading} className="login-btn" type="submit"
                  onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 1)')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 0.9)')}
                >Log In</button>
              </form>
          {/* Display a link to the signup page */}
          <div className='signup-lnk'>
            Need an Account? <Link to="/signup">Sign up</Link>
          </div>
          </div>
        </div>
    </>
  )
}
