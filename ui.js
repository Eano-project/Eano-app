// ui.js
import { setLanguage } from './lang.js';
import {
  loginWithEmail,
  signUp,
  signUpWithPhone,
  loginWithPhone,
  verifyPhoneOTP,
  signInWithGoogle,
  signInWithFacebook,
  signInWithGitHub,
  auth,
  onAuthStateChanged
} from './auth.js';
import { db, doc, getDoc } from './firebase.js';

// Debug: Confirm imports
console.log('UI.js loaded with functions:', { signInWithGoogle, signInWithFacebook, signInWithGitHub });

// Capture Referral from URL
const urlParams = new URLSearchParams(window.location.search);
const refCode = urlParams.get('ref');
if (refCode) {
  document.getElementById('signup-referral').value = refCode;
}

// Inject Countries Datalist
const template = document.getElementById('countries-template');
fetch('countries.html')
  .then(response => response.text())
  .then(html => {
    template.innerHTML = html;
  })
  .catch(error => console.error('Failed to load countries:', error));

// Sign-Up Form
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signup-username').value.trim();
  const referral = document.getElementById('signup-referral').value || '';
  const password = document.getElementById('signup-password').value;

  if (document.getElementById('signup-email').style.display === 'block') {
    const email = document.getElementById('signup-email-input').value.trim();
    try {
      await signUp(email, password, username, referral);
      alert('✅ Sign-up successful! Redirecting...');
      window.location.href = 'welcome.html';
    } catch (e) {
      console.error('Sign-up error:', e);
      alert('❌ Sign-up failed: ' + e.message);
      document.getElementById('signup-username').value = username;
      document.getElementById('signup-email-input').value = email;
      document.getElementById('signup-password').value = password;
    }
  }
});

const signupSendOtp = document.getElementById('signup-send-otp');
const signupOtp = document.getElementById('signup-otp');
const signupVerifyOtp = document.getElementById('signup-verify-otp');

if (signupSendOtp) {
  signupSendOtp.addEventListener('click', async () => {
    const countryCode = document.getElementById('signup-country-code').value.split(' ')[1];
    const phoneNumber = countryCode + document.getElementById('signup-phone-input').value;
    const username = document.getElementById('signup-username').value.trim();
    const referral = document.getElementById('signup-referral').value || '';
    try {
      await signUpWithPhone(phoneNumber, username, referral);
      signupSendOtp.style.display = 'none';
      signupOtp.style.display = 'block';
      signupVerifyOtp.style.display = 'block';
      alert('✅ OTP sent to ' + phoneNumber);
    } catch (e) {
      console.error('Phone sign-up error:', e);
      alert('❌ Failed to send OTP: ' + e.message);
    }
  });
}

if (signupVerifyOtp) {
  signupVerifyOtp.addEventListener('click', async () => {
    const otp = document.getElementById('signup-otp').value;
    try {
      await verifyPhoneOTP(otp, true);
    } catch (e) {
      console.error('OTP verification error:', e);
      alert('❌ OTP verification failed: ' + e.message);
    }
  });
}

// Login Form
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email-input').value;
  const password = document.getElementById('login-password').value;
  localStorage.setItem('login-email', email);
  localStorage.setItem('login-password', password);
  try {
    await loginWithEmail(email, password);
    // Redirect handled by onAuthStateChanged
  } catch (e) {
    console.error('Login error:', e);
    alert('❌ Login failed: ' + e.message);
    document.getElementById('login-email-input').value = email;
    document.getElementById('login-password').value = password;
  }
});

const loginSendOtp = document.getElementById('login-send-otp');
const loginOtp = document.getElementById('login-otp');
const loginVerifyOtp = document.getElementById('login-verify-otp');

if (loginSendOtp) {
  loginSendOtp.addEventListener('click', async () => {
    const countryCode = document.getElementById('login-country-code').value.split(' ')[1];
    const phoneNumber = countryCode + document.getElementById('login-phone-input').value;
    try {
      await loginWithPhone(phoneNumber);
      loginSendOtp.style.display = 'none';
      loginOtp.style.display = 'block';
      loginVerifyOtp.style.display = 'block';
      alert('✅ OTP sent to ' + phoneNumber);
    } catch (e) {
      console.error('Phone login error:', e);
      alert('❌ Failed to send OTP: ' + e.message);
    }
  });
}

if (loginVerifyOtp) {
  loginVerifyOtp.addEventListener('click', async () => {
    const otp = document.getElementById('login-otp').value;
    try {
      await verifyPhoneOTP(otp, false);
    } catch (e) {
      console.error('OTP verification error:', e);
      alert('❌ OTP verification failed: ' + e.message);
    }
  });
}

// Social Sign-In
document.getElementById('google-signin')?.addEventListener('click', async () => {
  console.log('Google Sign-In clicked');
  try {
    const redirectUrl = await signInWithGoogle();
    window.location.href = redirectUrl;
  } catch (e) {
    console.error('Google Sign-In error:', e);
    alert('❌ Google Sign-In failed: ' + e.message);
  }
});

document.getElementById('facebook-signin')?.addEventListener('click', async () => {
  console.log('Facebook Sign-In clicked');
  try {
    const redirectUrl = await signInWithFacebook();
    window.location.href = redirectUrl;
  } catch (e) {
    console.error('Facebook Sign-In error:', e);
    alert('❌ Facebook Sign-In failed: ' + e.message);
  }
});

document.getElementById('github-signin')?.addEventListener('click', async () => {
  console.log('GitHub Sign-In clicked');
  try {
    const redirectUrl = await signInWithGitHub();
    window.location.href = redirectUrl;
  } catch (e) {
    console.error('GitHub Sign-In error:', e);
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
      console.error('Firestore error:', e);
      window.location.href = 'welcome.html'; // Fallback
    }
  }
});

// Persist login form inputs on page load
window.addEventListener('load', () => {
  const savedEmail = localStorage.getItem('login-email');
  const savedPassword = localStorage.getItem('login-password');
  if (savedEmail) document.getElementById('login-email-input').value = savedEmail;
  if (savedPassword) document.getElementById('login-password').value = savedPassword;
});

// Toggle Auth
const toggleLink = document.getElementById('toggle-auth');
const signupSection = document.getElementById('signup-section');
const loginSection = document.getElementById('login-section');

if (toggleLink) {
  signupSection.classList.add('active'); // Show sign-up by default
  toggleLink.addEventListener('click', () => {
    if (signupSection.classList.contains('active')) {
      signupSection.classList.remove('active');
      loginSection.classList.add('active');
      toggleLink.textContent = "Don't have an account? Sign Up";
    } else {
      signupSection.classList.add('active');
      loginSection.classList.remove('active');
      toggleLink.textContent = "Already have an account? Login";
    }
  });
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.getElementById('auth-body');

if (themeToggle) {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
  }
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const mode = body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', mode);
  });
}

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

// Sign-Up Email/Phone Toggle
const signupEmailToggle = document.getElementById('signup-email-toggle');
const signupPhoneToggle = document.getElementById('signup-phone-toggle');
const signupEmail = document.getElementById('signup-email');
const signupPhone = document.getElementById('signup-phone');

if (signupEmailToggle && signupPhoneToggle) {
  signupEmail.style.display = 'block'; // Default to email
  signupEmailToggle.addEventListener('click', () => {
    signupEmail.style.display = 'block';
    signupPhone.style.display = 'none';
  });
  signupPhoneToggle.addEventListener('click', () => {
    signupEmail.style.display = 'none';
    signupPhone.style.display = 'block';
  });
}

// Login Email/Phone Toggle
const loginEmailToggle = document.getElementById('login-email-toggle');
const loginPhoneToggle = document.getElementById('login-phone-toggle');
const loginEmail = document.getElementById('login-email');
const loginPhone = document.getElementById('login-phone');

if (loginEmailToggle && loginPhoneToggle) {
  loginEmail.style.display = 'block'; // Default to email
  loginEmailToggle.addEventListener('click', () => {
    loginEmail.style.display = 'block';
    loginPhone.style.display = 'none';
  });
  loginPhoneToggle.addEventListener('click', () => {
    loginEmail.style.display = 'none';
    loginPhone.style.display = 'block';
  });
                                    }
