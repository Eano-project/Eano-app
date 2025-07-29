// ui.js
import { setLanguage } from './lang.js';

// Initialize Countries in Local Storage (if not already present)
const countries = [
  { code: '+234', name: 'Nigeria 🇳🇬' },
  { code: '+1', name: 'United States 🇺🇸' },
  { code: '+44', name: 'United Kingdom 🇬🇧' },
  { code: '+33', name: 'France 🇫🇷' },
  { code: '+49', name: 'Germany 🇩🇪' },
  // Add more countries as needed
];
if (!localStorage.getItem('countries')) {
  localStorage.setItem('countries', JSON.stringify(countries));
}

// Populate Countries Datalist
const countriesList = JSON.parse(localStorage.getItem('countries') || '[]');
const datalist = document.getElementById('countries');
countriesList.forEach(country => {
  const option = document.createElement('option');
  option.value = `${country.name} ${country.code}`;
  datalist.appendChild(option);
});

// Capture Referral from URL
const urlParams = new URLSearchParams(window.location.search);
const refCode = urlParams.get('ref');
if (refCode) {
  document.getElementById('signup-referral').value = refCode;
}

// Sign-Up Form
document.getElementById('signup-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('signup-username').value.trim();
  const referral = document.getElementById('signup-referral').value || '';
  const password = document.getElementById('signup-password').value;

  if (document.getElementById('signup-email').style.display === 'block') {
    const email = document.getElementById('signup-email-input').value.trim();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
      alert('❌ Email already registered!');
      return;
    }
    users[email] = { username, password, seenWelcome: false };
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', email);
    alert('✅ Sign-up successful! Redirecting...');
    window.location.href = 'welcome.html';
  }
});

const signupSendOtp = document.getElementById('signup-send-otp');
const signupOtp = document.getElementById('signup-otp');
const signupVerifyOtp = document.getElementById('signup-verify-otp');

if (signupSendOtp) {
  signupSendOtp.addEventListener('click', () => {
    const countryCode = document.getElementById('signup-country-code').value.split(' ')[1];
    const phoneNumber = countryCode + document.getElementById('signup-phone-input').value;
    const username = document.getElementById('signup-username').value.trim();
    const referral = document.getElementById('signup-referral').value || '';
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Simulate OTP
    localStorage.setItem('tempSignupData', JSON.stringify({ phoneNumber, username, referral, otp }));
    signupSendOtp.style.display = 'none';
    signupOtp.style.display = 'block';
    signupVerifyOtp.style.display = 'block';
    alert(`✅ OTP ${otp} sent to ${phoneNumber} (simulated)`);
  });
}

if (signupVerifyOtp) {
  signupVerifyOtp.addEventListener('click', () => {
    const otp = document.getElementById('signup-otp').value;
    const tempData = JSON.parse(localStorage.getItem('tempSignupData') || '{}');
    if (tempData.otp === otp) {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      const { phoneNumber, username, referral } = tempData;
      if (!users[phoneNumber]) {
        users[phoneNumber] = { username, password: 'simulated', seenWelcome: false };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', phoneNumber);
        localStorage.removeItem('tempSignupData');
        alert('✅ Sign-up successful! Redirecting...');
        window.location.href = 'welcome.html';
      } else {
        alert('❌ Phone number already registered!');
      }
    } else {
      alert('❌ Invalid OTP!');
    }
  });
}

// Login Form
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email-input').value;
  const password = document.getElementById('login-password').value;
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[email] && users[email].password === password) {
    localStorage.setItem('currentUser', email);
    localStorage.setItem('login-email', email);
    localStorage.setItem('login-password', password);
    alert('✅ Login successful! Redirecting...');
    window.location.href = users[email].seenWelcome ? 'dashboard.html' : 'welcome.html';
  } else {
    alert('❌ Invalid email or password!');
  }
});

const loginSendOtp = document.getElementById('login-send-otp');
const loginOtp = document.getElementById('login-otp');
const loginVerifyOtp = document.getElementById('login-verify-otp');

if (loginSendOtp) {
  loginSendOtp.addEventListener('click', () => {
    const countryCode = document.getElementById('login-country-code').value.split(' ')[1];
    const phoneNumber = countryCode + document.getElementById('login-phone-input').value;
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[phoneNumber]) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Simulate OTP
      localStorage.setItem('tempLoginData', JSON.stringify({ phoneNumber, otp }));
      loginSendOtp.style.display = 'none';
      loginOtp.style.display = 'block';
      loginVerifyOtp.style.display = 'block';
      alert(`✅ OTP ${otp} sent to ${phoneNumber} (simulated)`);
    } else {
      alert('❌ Phone number not registered!');
    }
  });
}

if (loginVerifyOtp) {
  loginVerifyOtp.addEventListener('click', () => {
    const otp = document.getElementById('login-otp').value;
    const tempData = JSON.parse(localStorage.getItem('tempLoginData') || '{}');
    if (tempData.otp === otp) {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      const { phoneNumber } = tempData;
      if (users[phoneNumber]) {
        localStorage.setItem('currentUser', phoneNumber);
        localStorage.setItem('login-email', phoneNumber); // Use phone as key
        localStorage.setItem('login-password', users[phoneNumber].password);
        localStorage.removeItem('tempLoginData');
        alert('✅ Login successful! Redirecting...');
        window.location.href = users[phoneNumber].seenWelcome ? 'dashboard.html' : 'welcome.html';
      }
    } else {
      alert('❌ Invalid OTP!');
    }
  });
}

// Toggle Auth
const toggleLink = document.getElementById('toggle-auth');
const signupSection = document.getElementById('signup-section');
const loginSection = document.getElementById('login-section');

if (toggleLink) {
  signupSection.classList.add('active');
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
  signupEmail.style.display = 'block';
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
  loginEmail.style.display = 'block';
  loginEmailToggle.addEventListener('click', () => {
    loginEmail.style.display = 'block';
    loginPhone.style.display = 'none';
  });
  loginPhoneToggle.addEventListener('click', () => {
    loginEmail.style.display = 'none';
    loginPhone.style.display = 'block';
  });
}
