// auth.js
import { app } from './firebase.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithCredential
} from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';
import { initializeAppCheck, ReCaptchaV3Provider } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app-check.js';

// Load FingerprintJS
const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4').then(FingerprintJS => FingerprintJS.load());

const auth = getAuth(app);
const db = getFirestore(app);

// Enable App Check (already initialized in firebase.js, but included for completeness)
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LdmTJIrAAAAAJtp-6RfYjaY89myfDU6tZ7pIA-w'),
  isTokenAutoRefreshEnabled: true
});

let verificationId = null;

function setupRecaptcha() {
  window.recaptchaVerifier = new RecaptchaVerifier('phone-section', {
    'size': 'invisible',
    'callback': (response) => {
      console.log("reCAPTCHA verified");
    }
  }, auth);
}

async function getFingerprint() {
  const fp = await fpPromise;
  const result = await fp.get();
  return result.visitorId;
}

function storeUserInfoLocally(email, username, referral, fingerprint) {
  if (email) localStorage.setItem('email', email);
  if (username) localStorage.setItem('username', username);
  if (referral) localStorage.setItem('referral', referral);
  if (fingerprint) localStorage.setItem('fingerprint', fingerprint);
}

async function loginWithEmail(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    throw new Error('Login failed: ' + e.message);
  }
}

async function signUp(email, password, username, referral) {
  const fingerprint = await getFingerprint();
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const userId = result.user.uid;

    await setDoc(doc(db, 'users', userId), {
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
      miningLevel: '🐥 Chicken',
      avatar: 'default.png'
    });

    if (referral) {
      const referrerRef = doc(db, 'users', referral);
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
    return userId;
  } catch (e) {
    throw new Error('Sign-up failed: ' + e.message);
  }
}

async function handleSocialLogin(result) {
  const userId = result.user.uid;
  const email = result.user.email;
  const fingerprint = await getFingerprint();

  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email,
      username: result.user.displayName || userId.slice(0, 8),
      referral: '',
      fingerprint,
      createdAt: new Date(),
      verified: false,
      seenWelcome: false,
      balance: 2.0,
      trustScore: 0,
      referralCount: 0,
      miningLevel: '🐥 Chicken',
      avatar: 'default.png'
    });
    storeUserInfoLocally(email, result.user.displayName || userId.slice(0, 8), '', fingerprint);
    return 'welcome.html';
  } else {
    const data = snap.data();
    storeUserInfoLocally(data.email, data.username || '', data.referral || '', data.fingerprint || '');
    return data.seenWelcome ? 'dashboard.html' : 'welcome.html';
  }
}

async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile email');
    const result = await signInWithPopup(auth, provider);
    return await handleSocialLogin(result);
  } catch (e) {
    throw new Error('Google Sign-In failed: ' + e.message);
  }
}

async function signInWithFacebook() {
  try {
    const provider = new FacebookAuthProvider();
    provider.addScope('public_profile,email');
    const result = await signInWithPopup(auth, provider);
    return await handleSocialLogin(result);
  } catch (e) {
    throw new Error('Facebook Sign-In failed: ' + e.message);
  }
}

async function signInWithGitHub() {
  try {
    const provider = new GithubAuthProvider();
    provider.addScope('user:email');
    const result = await signInWithPopup(auth, provider);
    return await handleSocialLogin(result);
  } catch (e) {
    throw new Error('GitHub Sign-In failed: ' + e.message);
  }
}

// Phone Sign-Up with OTP
async function signUpWithPhone(phoneNumber, username, referral) {
  const fingerprint = await getFingerprint();
  setupRecaptcha();
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    verificationId = confirmationResult.verificationId;
    // OTP verification will be handled separately via verifyPhoneOTP
    // For now, store temporary data
    localStorage.setItem('tempSignupData', JSON.stringify({ username, referral, fingerprint, phoneNumber }));
    alert('OTP sent to ' + phoneNumber + '. Please verify to complete sign-up.');
    return verificationId;
  } catch (e) {
    throw new Error('Phone sign-up failed: ' + e.message);
  }
}

// Phone Login
async function loginWithPhone(phoneNumber) {
  setupRecaptcha();
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
    verificationId = confirmationResult.verificationId;
    document.getElementById('send-otp').style.display = 'none';
    document.getElementById('otp').style.display = 'block';
    document.getElementById('verify-otp').style.display = 'block';
    alert('OTP sent to ' + phoneNumber);
    return verificationId;
  } catch (error) {
    throw new Error('Failed to send OTP: ' + error.message);
  }
}

// Verify OTP for both Sign-Up and Login
async function verifyPhoneOTP(otp) {
  try {
    const credential = await signInWithCredential(auth.PhoneAuthProvider.credential(verificationId, otp));
    const userId = credential.user.uid;

    // Handle sign-up completion if temp data exists
    const tempSignupData = JSON.parse(localStorage.getItem('tempSignupData'));
    if (tempSignupData) {
      const { username, referral, fingerprint, phoneNumber } = tempSignupData;
      await setDoc(doc(db, 'users', userId), {
        phone: phoneNumber,
        username,
        referral,
        fingerprint,
        createdAt: new Date(),
        verified: false,
        seenWelcome: false,
        balance: 2.0,
        trustScore: 0,
        referralCount: 0,
        miningLevel: '🐥 Chicken',
        avatar: 'default.png'
      });

      if (referral) {
        const referrerRef = doc(db, 'users', referral);
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

      storeUserInfoLocally(null, username, referral, fingerprint);
      localStorage.removeItem('tempSignupData');
      alert('Sign-up successful! Redirecting...');
      window.location.href = 'welcome.html';
    } else {
      // Handle login
      alert('Phone login successful! Redirecting...');
      window.location.href = 'dashboard.html';
    }

    return userId;
  } catch (error) {
    throw new Error('OTP verification failed: ' + error.message);
  }
}

// Export all functions
export {
  auth,
  onAuthStateChanged,
  loginWithEmail,
  signUp,
  signUpWithPhone,
  loginWithPhone,
  verifyPhoneOTP,
  signInWithGoogle,
  signInWithFacebook,
  signInWithGitHub
};
