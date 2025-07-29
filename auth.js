// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB84-ptrf28a2L9B787V7Qhamm7LhgrxVQ",
  authDomain: "eano-project.firebaseapp.com",
  projectId: "eano-project",
  storageBucket: "eano-project.firebasestorage.app",
  messagingSenderId: "411501268157",
  appId: "1:411501268157:web:0b28c24497ab2fb750fbd4",
  measurementId: "G-P339H0ZQQD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export function signUp(email, password, username, referral = null) {
  console.log('Sign-up attempt:', { email, username, referral });
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('User created:', userCredential.user.uid);
      return setDoc(doc(db, 'users', userCredential.user.uid), {
        username,
        email,
        referral,
        createdAt: new Date().toISOString(),
        seenWelcome: false
      });
    })
    .then(() => console.log('User data saved to Firestore'));
}

export function login(email, password) {
  console.log('Login attempt:', { email });
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('User logged in:', userCredential.user.uid);
      return getDoc(doc(db, 'users', userCredential.user.uid));
    });
}

export function signInWithGoogle() {
  console.log('Google sign-in attempt');
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider)
    .then((result) => {
      console.log('Google user:', result.user.uid);
      return setDoc(doc(db, 'users', result.user.uid), {
        username: result.user.displayName || 'GoogleUser',
        email: result.user.email,
        referral: null,
        createdAt: new Date().toISOString(),
        seenWelcome: false
      }, { merge: true });
    });
}

export { auth, db, onAuthStateChanged };
