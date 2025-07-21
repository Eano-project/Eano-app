// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getDatabase,
  ref as dbRef,
  set as dbSet,
  get as dbGet,
  update as dbUpdate,
  remove as dbRemove,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC8fSr1NX1jE0uJ5QfRikf6j-PMb1XhtUs",
  authDomain: "eano-app-3f678.firebaseapp.com",
  databaseURL: "https://eano-app-3f678-default-rtdb.firebaseio.com",
  projectId: "eano-app-3f678",
  storageBucket: "eano-app-3f678.appspot.com",
  messagingSenderId: "566183355081",
  appId: "1:566183355081:web:e8d8aa13ba30099392e318",
  measurementId: "G-GE2V793DCE"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize App Check with reCAPTCHA v3
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LdqPYorAAAAACm7Mld-MQn53dL_96tX8qAaE0k1'), // Your site key
  isTokenAutoRefreshEnabled: true,
});

// ✅ Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// ✅ Realtime Database
const realtimeDB = getDatabase(app);

// ✅ Firestore
const firestore = getFirestore(app);

// ✅ Export everything for use in other files
export {
  app,
  appCheck,
  auth,
  googleProvider,
  facebookProvider,
  signInWithPopup,
  onAuthStateChanged,
  realtimeDB,
  dbRef,
  dbSet,
  dbGet,
  dbUpdate,
  dbRemove,
  firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
};
