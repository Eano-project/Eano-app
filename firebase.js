// firebase.js

// ✅ Import Firebase v10.12.2 CDN modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAnalytics, isSupported as isAnalyticsSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getMessaging, isSupported as isMessagingSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-performance.js";

// ✅ Injected via Netlify Environment Variables
const firebaseConfig = {
  apiKey: window.FIREBASE_API_KEY,
  authDomain: window.FIREBASE_AUTH_DOMAIN,
  databaseURL: window.FIREBASE_DATABASE_URL,
  projectId: window.FIREBASE_PROJECT_ID,
  storageBucket: window.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID,
  appId: window.FIREBASE_APP_ID,
  measurementId: window.FIREBASE_MEASUREMENT_ID
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Core Firebase services
const auth = getAuth(app);
const rtdb = getDatabase(app);         // Realtime Database
const storage = getStorage(app);
const performance = getPerformance(app);

// ✅ Optional: Analytics & Messaging
let analytics = null;
let messaging = null;

isAnalyticsSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

isMessagingSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
  }
});

// ✅ Google Sign-In
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("✅ Google Signed In:", result.user.displayName);
    // Redirect or update UI here if needed
  } catch (err) {
    console.error("❌ Google Sign-In Failed:", err.message);
  }
}

// ✅ Facebook Sign-In
async function signInWithFacebook() {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("✅ Facebook Signed In:", result.user.displayName);
    // Redirect or update UI here if needed
  } catch (err) {
    console.error("❌ Facebook Sign-In Failed:", err.message);
  }
}

// ✅ Export all modules you need
export {
  app,
  auth,
  rtdb,
  storage,
  performance,
  analytics,
  messaging,
  signInWithGoogle,
  signInWithFacebook
};
