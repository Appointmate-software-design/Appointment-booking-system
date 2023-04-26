// Import the necessary React components and hooks
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Define a functional component for the private route
export default function PrivateRoute({ children }) {

  // Access the "authentication" context of the app using the "useAuth" hook
  const { currentUser } = useAuth();

  // If the user is logged in, render the child components, otherwise redirect to the login page
  return currentUser ? children : <Navigate to="/login" />;
}

// This is a private component that is used to protect a route. 
// It checks if the user is currently logged in by checking the "currentUser" object from the "useAuth" hook.
// If the user is logged in, it renders the children components that were passed to it as props.
// If the user is not logged in, it redirects them to the login page using the "Navigate" component from "react-router-dom".
