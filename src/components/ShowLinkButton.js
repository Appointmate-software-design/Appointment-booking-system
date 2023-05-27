// Importing necessary modules
import { useState, useEffect, useRef } from 'react';
import './EventCard.css'

// This component deals with the show link button and how it appears on the page, as well as what happens when you click it and gives you the ability to copy that link and hide it.
export default function ShowLinkButton({ eventData }) {
  const [showLink, setShowLink] = useState(false);
  const linkRef = useRef(null);

  useEffect(() => {
    if (showLink && linkRef.current) {
      // Calculates the positioning of the link button if it extends beyond the window width
      const linkWidth = linkRef.current.offsetWidth;
      const containerWidth = window.innerWidth;
      const containerRight = containerWidth - linkWidth - 10; // 10px for padding

      if (linkRef.current.offsetLeft > containerRight) {
        linkRef.current.style.left = `${containerRight}px`;
      }
    }
  }, [showLink]);

  // Copies the link to the clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/events/${eventData.id}`);
  };

  // Hides the link button
  const handleHideLink = () => {
    setShowLink(false);
  };

  // Renders the component
  return (
    <div style={{ position: 'relative' }}>
      {/* Show link button */}
      <button className='link-btn' onClick={() => setShowLink(true)}
      onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 1)')}
      onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 0.9)')}
      >
        Show Link
      </button>
      {/* Link display and hide button */}
      {showLink && (
        <div
          ref={linkRef}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '999',
            boxShadow: '1px 2px 3px 0px rgba(0, 0, 0, 0.5)',
            border: 'none',
            borderRadius: '5px',
            padding: '1em',
            backgroundColor: 'white',
          }}
        >
          <p>{`http://localhost:3000/${eventData.id}`}</p>
          <button className='copyLink-btn' onClick={handleCopyLink}
          onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 1)')}
          onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 0.9)')}
          >
            Copy Link </button>
          <button  className='hide-btn' onClick={handleHideLink}
          onMouseOver={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 1)')}
          onMouseOut={(e) => (e.target.style.backgroundColor = 'rgba(82, 82, 213, 0.9)')}
          >
            Hide Link
          </button>
        </div>
      )}
    </div>
  );
}
