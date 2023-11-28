
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD-5Qi5sT1tRP_Rt--u7Du25YBevOYlGc0",
  authDomain: "annular-tempo-392900.firebaseapp.com",
  projectId: "annular-tempo-392900",
  storageBucket: "annular-tempo-392900.appspot.com",
  messagingSenderId: "948176602945",
  appId: "1:948176602945:web:7c3acd6c15f737f62dc3c0",
  measurementId: "G-M84CSVT5M3"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage };