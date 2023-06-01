// Importing necessary modules
import { useState, useEffect, useRef } from 'react';

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
    navigator.clipboard.writeText(`https://appointmate-826f0.web.app/events/${eventData.id}`);
  };

  // Hides the link button
  const handleHideLink = () => {
    setShowLink(false);
  };

  // Renders the component
  return (
    <div style={{ position: 'relative' }}>
      {/* Show link button */}
      <button 
        style={{
          backgroundColor: 'steelblue',
          borderRadius: '5px',
          width: '100px',
          height: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontWeight: 'normal'
        }} 
        onClick={() => setShowLink(true)}
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
            border: '2px solid teal',
            padding: '1em',
            backgroundColor: 'white',
          }}
        >
          <p>{`https://appointmate-826f0.web.app/${eventData.id}`}</p>
          <button 
            style={{ backgroundColor: 'steelblue', color: 'white', marginRight: '1em' }} 
            onClick={handleCopyLink}
          >
            Copy Link
          </button>
          <button 
            style={{ backgroundColor: 'steelblue', color: 'white' }} 
            onClick={handleHideLink}
          >
            Hide Link
          </button>
        </div>
      )}
    </div>
  );
}
