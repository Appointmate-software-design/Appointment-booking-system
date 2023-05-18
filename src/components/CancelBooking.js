import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import Title from './Title';

// CancelBooking component definition
export default function CancelBooking() {
    // Get the cancelId from the URL parameters

  const { cancelId } = useParams();

    // useEffect hook to perform the booking cancellation on component mount

  useEffect(() => {
        // Function to delete the booking with the provided cancelId from Firestore
    const deleteBooking = async () => {
      const q = query(collection(db, "bookedEvents"), where("cancelId", "==", cancelId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    };

        // Call the deleteBooking function

    
    deleteBooking();
  }, [cancelId]);

    // Render the CancelBooking component

  return (
    <div>
      <Title/>
      <div style={{
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  textAlign: 'center',
  color: 'darkblue',
  fontSize: '1.5em',
  fontWeight: 'bold'
}}>
  Your booking has been successfully cancelled.
  <p>Regards, </p>
  <p>The Appointmate Team</p>
</div>

    </div>
  );
}
