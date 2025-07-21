// auth.js (Realtime DB version, for Firebase 12)
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  ref,
  set,
  get,
  child
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const googleBtn = document.getElementById("google-signin");
const facebookBtn = document.getElementById("facebook-signin");

// SIGN UP (Realtime DB)
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const username = document.getElementById("signup-username").value.trim();
    const referral = document.getElementById("signup-referral").value.trim();

    if (username.length < 4 || password.length < 6) {
      alert("Username or password too short.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const userRef = ref(db, `users/${cred.user.uid}`);
      await set(userRef, {
        email,
        username,
        referralCode: referral || null,
        balance: 2,
        trustScore: 5,
        referralCount: 0,
        lastMine: null,
        createdAt: Date.now()
      });
      window.location.href = "setup.html";
    } catch (err) {
      alert("❌ Signup error: " + err.message);
    }
  });
}

// LOGIN
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (err) {
      alert("❌ Login error: " + err.message);
    }
  });
}

// GOOGLE SIGN-IN
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      const userRef = ref(db, `users/${uid}`);
      const snap = await get(userRef);
      if (!snap.exists()) {
        await set(userRef, {
          email: result.user.email,
          username: result.user.displayName || "eano_user",
          balance: 2,
          referralCount: 0,
          trustScore: 5,
          lastMine: null,
          createdAt: Date.now()
        });
      }
      window.location.href = "setup.html";
    } catch (err) {
      alert("❌ Google login error: " + err.message);
    }
  });
}

// FACEBOOK SIGN-IN
if (facebookBtn) {
  facebookBtn.addEventListener("click", async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      const userRef = ref(db, `users/${uid}`);
      const snap = await get(userRef);
      if (!snap.exists()) {
        await set(userRef, {
          email: result.user.email,
          username: result.user.displayName || "eano_user",
          balance: 2,
          referralCount: 0,
          trustScore: 5,
          lastMine: null,
          createdAt: Date.now()
        });
      }
      window.location.href = "setup.html";
    } catch (err) {
      alert("❌ Facebook login error: " + err.message);
    }
  });
}
