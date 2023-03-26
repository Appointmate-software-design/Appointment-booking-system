import React from 'react'

export default function Title() {
    return (
        <div style={{ padding: '2rem', position: 'relative', textAlign: 'center' }}>
          <h1 style={{
            backgroundImage: 'linear-gradient(to bottom, #0077B5, #FFFFFF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '70px'
          }}>appointmate</h1>
          <img src={process.env.PUBLIC_URL + '/logo-appointmate.png'} alt="Appointmate Logo" style={{ 
            width: '100px',
            height: 'auto',
            position: 'absolute',
            top: '1rem',
            left: '1rem'
          }} />
        </div>
        
      );
}
