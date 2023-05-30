// Importing necessary modules
import React, { useRef, useState } from 'react';
import { Container, Alert} from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Title from './Title';
import './SignUp.css'
import usePasswordToggle from './usePasswordToggle';

// Sign up component
export default function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();

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
      <Container className="container">
        <div className="signup-container">
              <h2 className="signup-text">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <form className='signup-form' onSubmit={handleSubmit}>
                <button className='signup-google'
                  onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 1)')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 0.9)')}
                >
                  <span className='btn-content'>
                    <img className='google' src={process.env.PUBLIC_URL + '/google.svg'}></img>
                    SignUp with Google
                  </span>
                </button>
                <hr className='hr-text' data-content='OR'></hr>
                  <label htmlFor='email'>Email</label>
                  <input type="email" ref={emailRef} id="email" placeholder='Email address'></input>
                  <label htmlFor="password">Password</label>
                  <div className='password-wrapper'>
                    <input type= {PasswordInputType} ref={passwordRef} id="password" placeholder='Password'></input>
                    <span className="passwordIcon">{ToggleIcon}</span>
                  </div>
                  <label htmlFor="password-confirm">Cornfirm password</label>
                  <div className='password-wrapper'>
                    <input type={PasswordInputType} ref={passwordConfirmRef} id="password-confirm" placeholder='Password'></input>
                    <span className="passwordIcon">{ToggleIcon}</span>
                  </div>
                <button disabled={loading} className="signup-btn" type="submit"
                  onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 1)')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 0.9)')}
                >
                  Sign Up
                </button>
              </form>
          <div className="lnk-text">
            Already have an Account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </Container>
    </>
  );
}
