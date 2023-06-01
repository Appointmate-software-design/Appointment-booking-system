import React, { useContext, useState, useEffect } from "react";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,signInWithPopup} from 'firebase/auth'

// create an auth context
export const AuthContext = React.createContext();

function googleSignin() {
  return signInWithPopup(auth, googleProvider);
}

// create a custom hook to access the auth context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(); // set up the state for the current user
  const [loading, setLoading] = useState(true); // set up a loading state to prevent displaying content before currentUser is set

  // function to sign up a new user with email and password
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // function to sign in a user with email and password
  function login(email,password){
    return signInWithEmailAndPassword(auth,email,password);
  }

  // function to sign out the current user
  function logout(){
    return auth.signOut()
  }

  // listen for changes in the authentication state and update the currentUser state accordingly
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user); // update the currentUser state
      setLoading(false); // set loading to false when the current user is set
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    googleSignin,
  };

  // render the AuthContext.Provider and only display children when loading is false
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// We don't render anything in our application until we have our current user set for the first time.
