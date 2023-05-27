import React from 'react'
import './Title.css'

// This component is the Title component and appears on every page.
// It contains the logo and the word "appointmate", the name of our app.
export default function Title() {
  return (
    <div className='header'
    >
      <h1 className='title'>
        AppointMate
      </h1>
      <img className='logo'
        src={process.env.PUBLIC_URL + '/logo-appointmate.png'}
        alt="Appointmate Logo"
      />
    </div>
  );
}
