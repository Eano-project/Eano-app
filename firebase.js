// firebase.js

// ✅ Import Firebase v10.12.2 CDN Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAnalytics, isSupported as isAnalyticsSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getMessaging, isSupported as isMessagingSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-performance.js";

// ✅ EANO App Firebase Configuration (new project)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
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
const db = getFirestore(app);
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

// ✅ Google Sign-In Handler (Modular Style)
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("✅ Signed in as:", user.displayName);
    // You can redirect or update UI here
  } catch (error) {
    console.error("❌ Google Sign-In failed:", error.message);
  }
}

// ✅ Export Firebase services and functions
export {
  app,
  auth,
  db,
  storage,
  performance,
  analytics,
  messaging,
  signInWithGoogle
};
