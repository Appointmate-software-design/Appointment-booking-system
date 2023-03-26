// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANZc6Ac4TRVRnbYCp0l6ucH_9eT63WN5Y",
  authDomain: "appointmate-826f0.firebaseapp.com",
  projectId: "appointmate-826f0",
  storageBucket: "appointmate-826f0.appspot.com",
  messagingSenderId: "785919256199",
  appId: "1:785919256199:web:ded4919b8eef2e551d7a22",
  measurementId: "G-FJ7FWC7LBK"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export default app;
export {db};
export { auth };