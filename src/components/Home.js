import React, { useState} from 'react';
import Title from './Title';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate,Routes,Route ,Outlet} from 'react-router-dom';
import NavLinks from './NavLinks';
import ScheduledEvents from './ScheduledEvents';
import EventList from './EventList';

export default function Home() {

    const [error,setError] = useState("")
    const {currentUser, logout} = useAuth()
    const navigate = useNavigate();
    async function handleLogout() {
        setError('')

        try{
            await logout()
            navigate('/login')
        } catch{
           setError("Failed to log out") 
           alert(error)
        }
    }


  return (

    <div>
    <Title/>
      <h2>Welcome {currentUser.email}</h2>
      <NavLinks/>

      <button onClick = {handleLogout}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'teal',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '1px 1px 2px grey',
        marginBottom: '20px',
        marginRight: '20px'
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = '#008080')}
      onMouseOut={(e) => (e.target.style.backgroundColor = 'teal')}
    
>
    Log Out
</button>
     
      <Routes>
      <Route path="/scheduledEvents" element={<ScheduledEvents/>}>   </Route>
      <Route path="/events" element={<EventList/>}>   </Route>
      </Routes>

    </div>
  )
}
