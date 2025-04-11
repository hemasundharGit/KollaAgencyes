import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCG1SNwmST6RSccQoQGDBtLuLRJl7Po_yg",
  authDomain: "kolla-agencies.firebaseapp.com",
  projectId: "kolla-agencies",
  storageBucket: "kolla-agencies.firebasestorage.app",
  messagingSenderId: "1051351133723",
  appId: "1:1051351133723:web:48c63c5fbe59963c82d2be",
  measurementId: "G-EHQKJC5L32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db }; 