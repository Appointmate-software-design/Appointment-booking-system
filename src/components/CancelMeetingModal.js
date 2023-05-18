import React from 'react';
import Modal from 'react-modal';
import './CancelMeetingModal.css';

// A React functional component that represents a modal dialog for canceling a meeting
// The component takes three props as input: isOpen, onClose, and name
// isOpen: a boolean that indicates whether the modal is currently open or closed
// name: a string that contains the name of the person with whom the meeting was scheduled
// onClose: a function that will be called when the user closes the modal

const CancelMeetingModal = ({ isOpen, onClose, name }) => {

    // Render the modal using the react-modal package
    // The modal is displayed only when the isOpen prop is true
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="cancel-meeting-modal"
            overlayClassName="modal-overlay"
            contentLabel="Cancel Meeting"
        >
            {/* The title of the modal */}
            <h3>Meeting Canceled</h3>

            {/* The body of the modal */}
            <p>
                Your meeting with <strong>{name}</strong> has been canceled.
            </p>
            <p>
                An email will be sent to him/her confirming this.
            </p>

            {/* A button that the user can click to close the modal */}
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
        </Modal>
    );
};

// Export the component so that it can be used by other parts of the application
export default CancelMeetingModal;
