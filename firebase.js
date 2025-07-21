<!-- firebase.js -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
  import { getDatabase, ref, set, get, update, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

  // Firebase config (safe to expose publicly)
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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);

  // Optional: expose globally for quick usage in HTML
  window.auth = auth;
  window.db = db;
  window.ref = ref;
  window.set = set;
  window.get = get;
  window.update = update;
  window.onValue = onValue;
  signInWithPopup,
    googleProvider,
    facebookProvider
  window.onAuthStateChanged = onAuthStateChanged;
window.firebaseApp = {
  };
</script>

  // Optional: check user login status
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("✅ Logged in as:", user.uid);
    } else {
      console.log("🔴 Not logged in");
    }
  });
</script>
