import React from 'react'

// This component is the Title component and appears on every page.
// It contains the logo and the word "appointmate", the name of our app.
export default function Title() {
  return (
    <div
      style={{
        padding: '2rem',
        position: 'relative',
        textAlign: 'center'
      }}
    >
      <h1
        style={{
          // Set the background color gradient to the text
          backgroundImage: 'linear-gradient(to bottom, #0077B5, #FFFFFF)',
          // Set the Webkit background clip to text to show the gradient
          WebkitBackgroundClip: 'text',
          // Set the text color to transparent to show the gradient
          WebkitTextFillColor: 'transparent',
          fontSize: '70px'
        }}
      >
        appointmate
      </h1>
      <img
        src={process.env.PUBLIC_URL + '/logo-appointmate.png'}
        alt="Appointmate Logo"
        style={{
          width: '100px',
          height: 'auto',
          position: 'absolute',
          top: '1rem',
          left: '1rem'
        }}
      />
    </div>
  );
}
