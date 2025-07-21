<!-- firebase.js -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
  import { getDatabase, ref, set, get, update, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyC8fSr1NX1jE0uJ5QfRikf6j-PMb1XhtUs",
    authDomain: "eano-app-3f678.firebaseapp.com",
    databaseURL: "https://eano-app-3f678-default-rtdb.firebaseio.com",
    projectId: "eano-app-3f678",
    storageBucket: "eano-app-3f678.appspot.com",
    messagingSenderId: "566183355081",
    appId: "1:566183355081:web:e8d8aa13ba30099392e318"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  // Expose for use in other scripts
  window.firebaseApp = {
    auth,
    db,
    ref,
    set,
    get,
    update,
    onValue,
    onAuthStateChanged,
    signInWithPopup,
    googleProvider,
    facebookProvider
  };
</script>
