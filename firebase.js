// firebase.js

// ✅ Import Firebase v10.12.2 CDN Modules
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
const rtdb = getDatabase(app);
export { rtdb };

// ✅ EANO App Firebase Configuration (new project)
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

import { FacebookAuthProvider, signInWithPopup as facebookSignInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ✅ Facebook Sign-In Handler
async function signInWithFacebook() {
  const provider = new FacebookAuthProvider();
  try {
    const result = await facebookSignInWithPopup(auth, provider);
    const user = result.user;
    console.log("✅ Facebook sign-in successful:", user.displayName);
    // Optionally redirect or update UI
  } catch (error) {
    console.error("❌ Facebook Sign-In failed:", error.message);
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
  signInWithGoogle,
  signInWithFacebook // 👈 export this
};
