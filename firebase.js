// ✅ Import Firebase v10.12.2 CDN Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-performance.js";
import { getAnalytics, isSupported as isAnalyticsSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getMessaging, isSupported as isMessagingSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

// ✅ EANO App Firebase Configuration
const firebaseConfig = {
  apiKey: window.FIREBASE_API_KEY,
  authDomain: "eano-app-3f678.firebaseapp.com",
  projectId: "eano-app-3f678",
  storageBucket: "eano-app-3f678.appspot.com",
  messagingSenderId: "566183355081",
  appId: "1:566183355081:web:e8d8aa13ba30099392e318",
  measurementId: "G-GE2V793DCE"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize Core Services
const auth = getAuth(app);
const rtdb = getDatabase(app);
const storage = getStorage(app);
const performance = getPerformance(app);

// ✅ Initialize Optional Services (Analytics + Messaging)
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

// ✅ Google Sign-In Handler
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("✅ Google Sign-In:", user.displayName);
  } catch (error) {
    console.error("❌ Google Sign-In failed:", error.message);
  }
}

// ✅ Facebook Sign-In Handler
async function signInWithFacebook() {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("✅ Facebook Sign-In:", user.displayName);
  } catch (error) {
    console.error("❌ Facebook Sign-In failed:", error.message);
  }
}

// ✅ Export Firebase services and sign-in methods
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
