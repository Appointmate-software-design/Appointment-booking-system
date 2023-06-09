import React from 'react';
import Modal from 'react-modal';
import './CancelMeetingModal.css';

//component for modal to show whether the rescheduling was succesful

const RescheduleMeetingModal = ({ isOpen, onClose, name }) => {
    //renders the component below
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="reschedule-meeting-modal"
            overlayClassName="modal-overlay"
            contentLabel="Reschedule Meeting"
        >
            <h3>Meeting Rescheduled</h3>
            <p>
                Your meeting with <strong>{name}</strong> has been rescheduled.
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

export default RescheduleMeetingModal;
