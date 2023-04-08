import React, {useRef, useState } from 'react'
import {Card, Form, Button,Alert,Container } from 'react-bootstrap'
import{useAuth} from '../contexts/AuthContext'
import{Link, useNavigate} from 'react-router-dom';
import Title from './Title';
export default function Login() {

// create two "refs" using the "useRef" hook
const emailRef = useRef()
const passwordRef = useRef()
const navigate = useNavigate()
const {login, currentUser} = useAuth()

// create two state variables using the "useState" hook
const [error,setError] = useState('')
const [loading, setLoading] = useState(false)
// define an asynchronous function named "handleSubmit" that will handle the form submission event
    async function handleSubmit(e) {
    e.preventDefault()
    try { 
    setError('')
    setLoading(true)
    await login(emailRef.current.value, passwordRef.current.value)
    navigate('/')//on a successful login, move to home page
    } catch (error) {
      // if there is an error, display an appropriate error message based on the error code returned by Firebase
        console.log(error.code)
        if(error.code === "auth/wrong-password"){
            setError("password is incorrect")
          }else if( error.code === "auth/user-not-found"){
            setError("user not found")
          }

    }
    setLoading(false)
}


// return a JS element that will render the login form
  return (
    <>
    <Title/>
        <Container 
      className = "d-flex align-Items-center justify-content-center" 
      style={{ minHeight: "100vh"}}>
        <div className="w-100 mt-5" style = {{maxWidth: "400px"}}>
      <Card>
        <Card.Body>
        <h2 className="text-center mb-4">Log In</h2>
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
        <Button disabled={loading} className="w-100 mt-3" type="submit">Log In</Button>
        </Form>
        </Card.Body>
      </Card>
    
    <div className='w-100 text-center mt-2' style={{ color: 'blue' }}>
        Need an Account? <Link to="/signup">Sign up</Link>
    </div>
    </div>
     </Container>
    </>
  )
}