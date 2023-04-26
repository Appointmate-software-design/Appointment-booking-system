// Component to display a modal with a confirmation message after a booking has been made
export default function ThankYouModal({ isOpen, onClose, email }) {
  // If the modal is closed, do not render anything
  if (!isOpen) return null;

  // Render the modal if it is open
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "8px",
          width: "80%",
          maxWidth: "400px",
        }}
      >
        <h2>Booking Confirmed</h2>
        <p>
          Thank you for booking with <strong>{email}</strong>.
        </p>
        <p>
          An email will be sent to you with the details of your booking.
        </p>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "teal",
            color: "white",
            borderRadius: "5px",
            marginTop: "20px",
            padding: "8px 16px",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
