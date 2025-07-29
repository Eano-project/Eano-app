// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB84-ptrf28a2L9B787V7Qhamm7LhgrxVQ",
  authDomain: "eano-project.firebaseapp.com",
  projectId: "eano-project",
  storageBucket: "eano-project.firebasestorage.app",
  messagingSenderId: "411501268157",
  appId: "1:411501268157:web:0b28c24497ab2fb750fbd4",
  measurementId: "G-P339H0ZQQD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export for use in other files
export { auth, db };
