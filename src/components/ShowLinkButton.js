import { useState, useEffect, useRef } from 'react';

//this file deals with the show link button and how it appears on the page, as well as what happens when you click it and gives you the ability to copy that link and hide it

export default function ShowLinkButton({ eventData }) {
  const [showLink, setShowLink] = useState(false);
  const linkRef = useRef(null);

  useEffect(() => {
    if (showLink && linkRef.current) {
      const linkWidth = linkRef.current.offsetWidth;
      const containerWidth = window.innerWidth;
      const containerRight = containerWidth - linkWidth - 10; // 10px for padding

      if (linkRef.current.offsetLeft > containerRight) {
        linkRef.current.style.left = `${containerRight}px`;
      }
    }
  }, [showLink]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/events/${eventData.id}`); //so that we can copy the link with ease
  };

  const handleHideLink = () => {
    setShowLink(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button style={{ backgroundColor: 'steelblue',
                        borderRadius: '5px',
                        width: '100px',
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        fontWeight: 'normal' }} onClick={() => setShowLink(true)}>Show Link</button> {/* button styling must be same as delete button in EventCard component */}
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
          <p>{`http://localhost:3000/${eventData.id}`}</p>
          <button style={{ backgroundColor: 'steelblue', color: 'white', marginRight: '1em' }} onClick={handleCopyLink}>Copy Link</button>
          <button style={{ backgroundColor: 'steelblue', color: 'white' }} onClick={handleHideLink}>Hide Link</button>
        </div>
      )}
    </div>
  );
}

  
