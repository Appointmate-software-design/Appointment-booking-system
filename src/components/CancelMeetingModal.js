import React from 'react';
import Modal from 'react-modal';
import './CancelMeetingModal.css';


//this component displays a modal that informs the user that a meeting has been canceled, and allows them to close the modal when they are done.

const CancelMeetingModal = ({ isOpen, onClose, name }) => {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="cancel-meeting-modal"
        overlayClassName="modal-overlay"
        contentLabel="Cancel Meeting"
      >
        <h3>Meeting Canceled</h3>
        <p>
          Your meeting with <strong>{name}</strong> has been canceled.
        </p>
        <p>
        An email will be sent to him/her confirming this.
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
      </Modal>
    );
  };
  
  export default CancelMeetingModal;
