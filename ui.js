// ui.js
import { auth, onAuthStateChanged, loginWithEmail, signUp, signInWithGoogle, signInWithFacebook, signInWithGitHub } from './auth.js';
import { db, doc, getDoc } from './firebase.js';

// Debug: Confirm imports
console.log('UI.js loaded with functions:', { signInWithGoogle, signInWithFacebook, signInWithGitHub });

// Capture Referral from URL
const urlParams = new URLSearchParams(window.location.search);
const refCode = urlParams.get("ref");
if (refCode) {
  document.getElementById("signup-referral").value = refCode;
}

// Sign Up Form
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const firstname = document.getElementById("signup-firstname").value.trim();
  const lastname = document.getElementById("signup-lastname").value.trim();
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const referral = document.getElementById("signup-referral").value || '';
  try {
    await signUp(email, password, username, referral);
    window.location.href = 'welcome.html';
  } catch (e) {
    console.error("Sign-up error:", e);
    alert('❌ Sign-up failed: ' + e.message);
    document.getElementById("signup-firstname").value = firstname;
    document.getElementById("signup-lastname").value = lastname;
    document.getElementById("signup-username").value = username;
    document.getElementById("signup-email").value = email;
    document.getElementById("signup-password").value = password;
  }
});

// Login Form
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  localStorage.setItem('login-email', email);
  localStorage.setItem('login-password', password);
  try {
    await loginWithEmail(email, password);
    // Redirect logic handled by onAuthStateChanged
  } catch (e) {
    console.error("Login error:", e);
    alert('❌ Login failed: ' + e.message);
    document.getElementById("login-email").value = email;
    document.getElementById("login-password").value = password;
  }
});

// Social Sign-In
document.getElementById("google-signin").addEventListener("click", async () => {
  console.log('Google Sign-In clicked');
  try {
    const redirectUrl = await signInWithGoogle();
    window.location.href = redirectUrl;
  } catch (e) {
    console.error("Google Sign-In error:", e);
    alert('❌ Google Sign-In failed: ' + e.message);
  }
});

document.getElementById("facebook-signin").addEventListener("click", async () => {
  console.log('Facebook Sign-In clicked');
  try {
    const redirectUrl = await signInWithFacebook();
    window.location.href = redirectUrl;
  } catch (e) {
    console.error("Facebook Sign-In error:", e);
    alert('❌ Facebook Sign-In failed: ' + e.message);
  }
});

document.getElementById("github-signin").addEventListener("click", async () => {
  console.log('GitHub Sign-In clicked');
  try {
    const redirectUrl = await signInWithGitHub();
    window.location.href = redirectUrl;
  } catch (e) {
    console.error("GitHub Sign-In error:", e);
    alert('❌ GitHub Sign-In failed: ' + e.message);
  }
});

// Auto-redirect based on auth and seenWelcome
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.seenWelcome) {
          window.location.href = 'dashboard.html';
        } else {
          window.location.href = 'welcome.html';
        }
      }
    } catch (e) {
      console.error("Firestore error:", e);
      window.location.href = 'welcome.html'; // Fallback
    }
  }
});

// Persist login form inputs on page load
window.addEventListener('load', () => {
  const savedEmail = localStorage.getItem('login-email');
  const savedPassword = localStorage.getItem('login-password');
  if (savedEmail) document.getElementById('login-email').value = savedEmail;
  if (savedPassword) document.getElementById('login-password').value = savedPassword;
});

// Toggle Auth
const toggleLink = document.getElementById("toggle-auth");
const signupSection = document.getElementById("signup-form");
const loginSection = document.getElementById("login-form");

toggleLink.addEventListener("click", () => {
  const isSignupVisible = signupSection.style.display !== "none";
  signupSection.style.display = isSignupVisible ? "none" : "block";
  loginSection.style.display = isSignupVisible ? "block" : "none";
  toggleLink.textContent = isSignupVisible
    ? "Don't have an account? Sign up"
    : "Already have an account? Login";
});

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
const body = document.getElementById("auth-body");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light-mode");
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  const mode = body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("theme", mode);
});

// PWA Installation
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn').style.display = 'block';
});

document.getElementById('installBtn').addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
      document.getElementById('installBtn').style.display = 'none';
    });
  }
});
