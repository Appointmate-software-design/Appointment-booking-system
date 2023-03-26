import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
    console.log(auth)
  function signup(email, password) {
    return createUserWithEmailAndPassword( auth, email, password);
  }

  function login(email,password){
    return signInWithEmailAndPassword(auth,email,password);
  }

  function logout(){
    return auth.signOut()
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
        setLoading(false);
        
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
  <AuthContext.Provider value={value}>
        {!loading && children}
  </AuthContext.Provider>
  );
}

// we don't render anything in our application untill we have our current user set for the first time

