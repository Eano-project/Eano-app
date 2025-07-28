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
  signInWithPopup
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

// Enable App Check
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LdmTJIrAAAAAJtp-6RfYjaY89myfDU6tZ7pIA-w'),
  isTokenAutoRefreshEnabled: true
});

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
      username: result.user.displayName || userId.slice(0, 8), // Default username from displayName or UID
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

export {
  auth,
  onAuthStateChanged,
  loginWithEmail,
  signUp,
  signInWithGoogle,
  signInWithFacebook,
  signInWithGitHub
};
