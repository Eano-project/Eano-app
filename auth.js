<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup
  } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
  import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc
  } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
  import {
    initializeAppCheck,
    ReCaptchaV3Provider
  } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-check.js";

  // Load FingerprintJS from CDN
  const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4').then(FingerprintJS => FingerprintJS.load());

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

  // ✅ Enable App Check with reCAPTCHA v3
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("6LdqPYorAAAAACm7Mld-MQn53dL_96tX8qAaE0k1"),
    isTokenAutoRefreshEnabled: true
  });

  const auth = getAuth(app);
  const db = getFirestore(app);

  async function getFingerprint() {
    const fp = await fpPromise;
    const result = await fp.get();
    return result.visitorId;
  }

  function storeUserInfoLocally(email, username, referral, fingerprint) {
    if (email) localStorage.setItem("email", email);
    if (username) localStorage.setItem("username", username);
    if (referral) localStorage.setItem("referral", referral);
    if (fingerprint) localStorage.setItem("fingerprint", fingerprint);
  }

  window.loginWithEmail = async function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      alert("Login failed: " + e.message);
    }
  };

  window.signUp = async function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const username = document.getElementById("username").value.trim();
    const referral = document.getElementById("referral").value.trim();
    const fingerprint = await getFingerprint();

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const userId = result.user.uid;

      await setDoc(doc(db, "users", userId), {
        email,
        username,
        referral,
        fingerprint,
        createdAt: new Date(),
        verified: false,
        seenWelcome: false,
        balance: 2.0,
        trustScore: 0,
        referralCount: 0,
        miningLevel: "🐥 Chicken",
        avatar: "default.png"
      });

      if (referral) {
        const referrerRef = doc(db, "users", referral);
        const referrerSnap = await getDoc(referrerRef);

        if (referrerSnap.exists()) {
          const refData = referrerSnap.data();
          await updateDoc(referrerRef, {
            balance: (refData.balance || 0) + 2,
            trustScore: (refData.trustScore || 0) + 5,
            referralCount: (refData.referralCount || 0) + 1
          });
        }
      }

      storeUserInfoLocally(email, username, referral, fingerprint);
      window.location.href = "welcome.html";
    } catch (e) {
      alert("Sign-up failed: " + e.message);
    }
  };

  async function handleSocialLogin(result) {
    const userId = result.user.uid;
    const email = result.user.email;
    const fingerprint = await getFingerprint();

    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        email,
        username: "",
        referral: "",
        fingerprint,
        createdAt: new Date(),
        verified: false,
        seenWelcome: false,
        balance: 2.0,
        trustScore: 0,
        referralCount: 0,
        miningLevel: "🐥 Chicken",
        avatar: "default.png"
      });
      storeUserInfoLocally(email, "", "", fingerprint);
      window.location.href = "welcome.html";
    } else {
      const data = snap.data();
      storeUserInfoLocally(data.email, data.username || "", data.referral || "", data.fingerprint || "");
      window.location.href = data.seenWelcome ? "dashboard.html" : "welcome.html";
    }
  }

  window.signInWithGoogle = async function () {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleSocialLogin(result);
    } catch (e) {
      alert("Google Sign-In failed: " + e.message);
    }
  };

  window.signInWithFacebook = async function () {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleSocialLogin(result);
    } catch (e) {
      alert("Facebook Sign-In failed: " + e.message);
    }
  };

  // Monitor login state & redirect
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      const seenWelcome = data.seenWelcome || false;
      const currentPath = window.location.pathname;

      if (currentPath.includes("index")) {
        window.location.href = seenWelcome ? "dashboard.html" : "welcome.html";
      }
    }
  });
</script>
