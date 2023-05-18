import { Container } from "react-bootstrap";
import SignUp from "./components/SignUp";
import Title from "./components/Title";
import RescheduleBooking from "./components/RescheduleBooking";
import CancelBooking from "./components/CancelBooking";
import Home from "./components/Home";
import Login from "./components/Login";
import CreateEventForm from './components/CreateEventForm'
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import ConfirmBookingView from './components/ConfirmBookingView'
import PrivateRoute from "./components/PrivateRoute";

// This component defines all the routes of our application using React Router.
// We also use PrivateRoute component to restrict access to certain pages when user is logged out.

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>} />
            <Route path="/create-event" element={<PrivateRoute><CreateEventForm/></PrivateRoute>} />
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/events/:eventId" element={<ConfirmBookingView/>}/>
            <Route path="/cancel/:cancelId" element={<CancelBooking/>} />
            <Route path="/reschedule/:cancelId/:eventId" element={<RescheduleBooking />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
