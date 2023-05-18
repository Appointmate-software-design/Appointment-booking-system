import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { collection, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
//function to handle the rescheduling of a booking

export default function RescheduleBooking() {
  const { cancelId, eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    //delete the booking
    const deleteBooking = async () => {
      const q = query(collection(db, "bookedEvents"), where("cancelId", "==", cancelId));
      const querySnapshot = await getDocs(q);

      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // After deletion, redirect the user to the events page
      navigate(`/events/${eventId}`);
    };

    deleteBooking();
  }, [cancelId, eventId, navigate]); // Added eventId and navigate to dependency array
}
