// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-check.js";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import {
  getDatabase,
  ref,
  set,
  update,
  onValue,
  get,
  push,
  runTransaction
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import {
  getStorage
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBNgkWFa0HXk2k0qndOWbtddfzFgkTtQCE",
  authDomain: "eano-app-3f678.firebaseapp.com",
  databaseURL: "https://eano-app-3f678-default-rtdb.firebaseio.com",
  projectId: "eano-app-3f678",
  storageBucket: "eano-app-3f678.appspot.com",
  messagingSenderId: "566183355081",
  appId: "1:566183355081:web:e8d8aa13ba30099392e318",
  measurementId: "G-GE2V793DCE"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ App Check with reCAPTCHA v3
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LdmTJIrAAAAAJtp-6RfYjaY89myfDU6tZ7pIA-w'),
  isTokenAutoRefreshEnabled: true
});

// ✅ Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);

// ✅ Export core services and helpers
export {
  app,
  analytics,
  appCheck,
  auth,
  db,
  rtdb,
  storage,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  ref,
  set,
  update,
  onValue,
  get,
  push,
  runTransaction,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider
};
