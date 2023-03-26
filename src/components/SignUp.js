import React, {useRef, useState } from 'react'
import {Card, Form, Button,Alert, Container } from 'react-bootstrap'
import{useAuth} from '../contexts/AuthContext'
import {Link, useNavigate} from 'react-router-dom'
import Title from './Title'
export default function SignUp() {

const emailRef = useRef()
const passwordRef = useRef()
const passwordConfirmRef = useRef()
const {signup, currentUser} = useAuth()
const [error,setError] = useState('')
const [loading, setLoading] = useState(false)
const navigate = useNavigate()

    async function handleSubmit(e) {
    e.preventDefault()
    if(passwordRef.current.value !== passwordConfirmRef.current.value){
        return setError('Passwords do not match')
    }
    try { 
    setError('')
    setLoading(true)
    await signup(emailRef.current.value, passwordRef.current.value)
    navigate('/home')//after a successful sign up
    } catch (error) {
        console.log(error.code)
        //throw error;
        //setError("Failed to create an Account")
        if (error.code === 'auth/invalid-email') {
            // Show an error message for invalid email
            setError('Please enter a valid email address');
          } else if (error.code === 'auth/wrong-password') {
            // Show an error message for wrong password
            setError('Incorrect password, please try again');
          } else if(error.code === 'auth/weak-password') {
            setError('Password must contain at least 6 characters')
          } else if(error.code === 'auth/email-already-in-use'){
            setError('Email is already in use');
          } else {
            setError('An error occured, please try again');
          }

    }
    setLoading(false)
}



  return (
    <>
    <Title/>
     <Container 
      className = "d-flex align-Items-center justify-content-center" 
      style={{ minHeight: "100vh"}}>
        <div className="w-100 mt-5" style = {{maxWidth: "400px"}}>
      <Card>
        <Card.Body>
        <h2 className="text-center mb-4">Sign Up</h2>
        {error && <Alert variant='danger'>{error}</Alert>}
        <Form onSubmit = {handleSubmit}>
        <Form.Group id = "email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" ref={emailRef}></Form.Control>
        </Form.Group>
        <Form.Group id = "password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" ref={passwordRef}></Form.Control>
        </Form.Group>
        <Form.Group id = "password-confirm">
        <Form.Label>Password Confirmation</Form.Label>
        <Form.Control type="password" ref={passwordConfirmRef}></Form.Control>
        </Form.Group>
        <Button disabled={loading} className="w-100 mt-3" type="submit">Sign Up</Button>
        </Form>
        </Card.Body>
      </Card>
     
     <div className='w-100 text-center mt-2' style={{ color: 'blue' }}>
        Already have an Account? <Link to='/login'>Log In</Link>
    </div>
    </div>
     </Container>

    </>
  )
}

//if its currently loading, we dont want to be able to resubmit our form
