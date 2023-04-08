import { Container } from "react-bootstrap";
import SignUp from "./components/SignUp";
import Title from "./components/Title";
import Home from "./components/Home";
import Login from "./components/Login";
import CreateEventForm from './components/CreateEventForm'
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import ConfirmBookingView from './components/ConfirmBookingView'
import PrivateRoute from "./components/PrivateRoute"; //this is so we can't access certain pages when we are logged out.
function App() {
  return (
    <div className="App">
        <Router>
      <AuthProvider>
        <Routes>
        <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>} />
        <Route path ='/create-event' element={<PrivateRoute><CreateEventForm/></PrivateRoute>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path ="/login" element={<Login/>}/>
        <Route path = 'events/:eventId' element={<ConfirmBookingView/>}/>
        </Routes>
      </AuthProvider>
      </Router>
     

     
    </div>
  );
}

export default App;
