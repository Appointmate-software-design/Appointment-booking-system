import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavLinks.css'

const NavLinks = () => {
  return (
    <div>
    <nav>
      
          <NavLink  to="/scheduledEvents" >
            Scheduled Events
          </NavLink>
        

          <NavLink to="/events" >
            Events
          </NavLink>

    </nav>
   </div>
  );
};

export default NavLinks;