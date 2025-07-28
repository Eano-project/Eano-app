import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';
import { signInWithPopup, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js';
import { auth, db, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from './firebase.js';

export async function signUp(email, password, username, referredBy) {
  const { createUserWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js');
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email,
    username,
    referredBy,
    balance: 0,
    trustScore: 0,
    miningStart: null,
    miningEnd: null,
    createdAt: new Date().toISOString(),
    seenWelcome: false
  });
}

export async function loginWithEmail(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.addScope('profile email');
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || '',
      photoURL: user.photoURL || '',
      firstName: user.displayName?.split(' ')[0] || '',
      lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
      username: '',
      referredBy: '',
      balance: 0,
      trustScore: 0,
      miningStart: null,
      miningEnd: null,
      createdAt: new Date().toISOString(),
      seenWelcome: false
    });
  }
}

export async function signInWithFacebook() {
  const provider = new FacebookAuthProvider();
  provider.addScope('public_profile,email');
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || '',
      photoURL: user.photoURL || '',
      firstName: user.displayName?.split(' ')[0] || '',
      lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
      username: '',
      referredBy: '',
      balance: 0,
      trustScore: 0,
      miningStart: null,
      miningEnd: null,
      createdAt: new Date().toISOString(),
      seenWelcome: false
    });
  }
}

export async function signInWithGitHub() {
  const provider = new GithubAuthProvider();
  provider.addScope('user:email');
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || '',
      photoURL: user.photoURL || '',
      firstName: user.displayName?.split(' ')[0] || '',
      lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
      username: '',
      referredBy: '',
      balance: 0,
      trustScore: 0,
      miningStart: null,
      miningEnd: null,
      createdAt: new Date().toISOString(),
      seenWelcome: false
    });
  }
}

export async function isAdmin(user) {
  if (!user) return false;
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  return userDoc.exists() && userDoc.data().isAdmin === true;
}
