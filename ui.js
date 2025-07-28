// scripts/ui.js (EANO - Unified Firebase UI Handler with Firestore + RTDB)

// ✅ Firebase Imports
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getDatabase,
  ref as rtdbRef,
  get as rtdbGet
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  initializeAppCheck,
  ReCaptchaV3Provider
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-check.js";

import { app } from "./firebase.js";

// ✅ App Check (ReCaptcha v3)
initializeAppCheck(app, {"6LdqPYorAAAAACm7Mld-MQn53dL_96tX8qAaE0k1"),
  isTokenAutoRefreshEnabled: true
});

// ✅ Firebase Instances
const auth = getAuth(app);
const db = getDatabase(app);
const firestore = getFirestore(app);

// 🏅 Trust Badge
function setTrustBadge(score) {
  const badgeEl = document.getElementById("trust-badge");
  let badge = "";

  if (score >= 10000) badge = "💎 O.G";
  else if (score >= 5000) badge = "🟢 Trusted Miner";
  else if (score >= 1000) badge = "🟡 Reliable Miner";
  else if (score >= 500) badge = "🔵 New Miner";
  else if (score < 100) badge = "🔴 Low Trust";
  else badge = ""; // 100–499 = no badge

  if (badgeEl) {
    badgeEl.textContent = badge;
    badgeEl.title = `TrustScore: ${score}`;
  }
}

// 🐾 Mining Badge (based on balance)
function setMiningBadge(balance) {
  const badgeEl = document.getElementById("level-badge");
  let badge = "";

  if (balance >= 10000) badge = "🐉 Dragon";
  else if (balance >= 5000) badge = "🐘 Elephant";
  else if (balance >= 2500) badge = "🦍 Gorilla";
  else if (balance >= 1200) badge = "🐻 Bear";
  else if (balance >= 600) badge = "🐯 Lion";
  else if (balance >= 300) badge = "🐼 Panda";
  else if (balance >= 150) badge = "🐺 Wolf";
  else if (balance >= 50) badge = "🐹 Hamster";
  else badge = "🐥 Chicken";

  if (badgeEl) {
    badgeEl.textContent = badge;
    badgeEl.title = `Mining Level: ${balance}`;
  }
}

// 👤 Load user data from Firebase
async function loadUserUI(uid) {
  try {
    // Realtime Database
    const userSnap = await rtdbGet(rtdbRef(db, `users/${uid}`));
    const userData = userSnap.exists() ? userSnap.val() : {};

    const balance = parseFloat(userData.balance || 0);
    const trustScore = parseInt(userData.trustScore || 0);

    // Firestore
    const docRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(docRef);
    const profileData = docSnap.exists() ? docSnap.data() : {};

    const username = profileData.username || userData.username || "Unknown";
    const realname = profileData.realName || "";
    const avatar = profileData.avatar || "assets/avatars/default-avatar.png";

    // 💰 Balance
    const balEl = document.getElementById("balance");
    if (balEl) balEl.textContent = balance.toFixed(3);

    // 👤 Username
    const userEl = document.getElementById("username");
    if (userEl) userEl.textContent = username;

    // 🧾 Real Name
    const nameEl = document.getElementById("realname");
    if (nameEl) nameEl.textContent = realname;

    // 🖼 Avatar
    const avatarEl = document.getElementById("user-avatar");
    if (avatarEl) {
      avatarEl.src = avatar;
      avatarEl.alt = username;
    }

    // 🏅 Badges
    setTrustBadge(trustScore);
    setMiningBadge(balance);

  } catch (err) {
    console.error("❌ Failed to load user data:", err);
  }
}

// 🌐 Language Selector
function setupLanguageSelector() {
  const langSelector = document.getElementById("language-selector");
  if (!langSelector) return;

  const languages = {
    en: "English",
    ig: "Igbo",
    yo: "Yoruba",
    ha: "Hausa",
    pg: "Pidgin"
  };

  for (const code in languages) {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = languages[code];
    langSelector.appendChild(opt);
  }

  langSelector.value = localStorage.getItem("lang") || "en";
  langSelector.onchange = () => {
    localStorage.setItem("lang", langSelector.value);
    location.reload();
  };
}

// 🌓 Theme Toggle
function setupThemeToggle() {
  const toggle = document.getElementById("toggle-theme");
  if (!toggle) return;

  toggle.onclick = () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  // Load saved theme
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.remove("dark");
  }
}

// 📲 Sidebar Toggle
function setupSidebarToggle() {
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.querySelector(".sidebar");
  if (menuBtn && sidebar) {
    menuBtn.onclick = () => {
      sidebar.classList.toggle("open");
    };
  }
}

// ✅ Auth State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadUserUI(user.uid);
  } else {
    console.warn("⚠️ User not signed in.");
  }
});

// 🌟 Init All UI
setupLanguageSelector();
setupThemeToggle();
setupSidebarToggle();
