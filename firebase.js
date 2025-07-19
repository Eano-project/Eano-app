// firebase.js

// ✅ Import Firebase v10.12.2 CDN Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAnalytics, isSupported as isAnalyticsSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getMessaging, isSupported as isMessagingSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-performance.js";

// ✅ EANO App Firebase Configuration (new project)
const firebaseConfig = {
  apiKey: "AIzaSyC8fSr1NX1jE0uJ5QfRikf6j-PMb1XhtUs",
  authDomain: "eano-app-3f678.firebaseapp.com",
  projectId: "eano-app-3f678",
  storageBucket: "eano-app-3f678.appspot.com",
  messagingSenderId: "566183355081",
  appId: "1:566183355081:web:e8d8aa13ba30099392e318",
  measurementId: "G-GE2V793DCE"
};
firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        console.log("Welcome,", user.displayName);
        // Redirect or store user info
      })
      .catch((error) => {
        console.error("Login failed", error);
      });
  }
</script>

<button onclick="signInWithGoogle()">Sign in with Google</button>
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

// ✅ Export Firebase services for use across your app
export {
  app,
  auth,
  db,
  storage,
  performance,
  analytics,
  messaging
};
