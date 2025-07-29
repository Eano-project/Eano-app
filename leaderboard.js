// leaderboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
      getFirestore,
        collection,
          getDocs,
            query,
              orderBy,
                limit
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB84-ptrf28a2L9B787V7Qhamm7LhgrxVQ",
  authDomain: "eano-project.firebaseapp.com",
  projectId: "eano-project",
  storageBucket: "eano-project.firebasestorage.app",
  messagingSenderId: "411501268157",
  appId: "1:411501268157:web:0b28c24497ab2fb750fbd4",
  measurementId: "G-P339H0ZQQD"
};

// ✅ Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🎖 TrustScore badge logic
function trustBadge(score = 0) {
      if (score >= 5000) return "💎 O.G";
        if (score >= 1000) return "🟢 Trusted Miner";
          if (score >= 500) return "🟡 Reliable Miner";
            if (score >= 300) return "🔵 New Miner";
              return "🔴 Low Trust";
}

// 🐾 Mining Level logic
function miningLevel(balance = 0) {
      if (balance >= 10000) return "🐉 Dragon";
        if (balance >= 5000) return "🐘 Elephant";
          if (balance >= 2500) return "🦍 Gorilla";
            if (balance >= 1200) return "🐻 Bear";
              if (balance >= 600) return "🐯 Lion";
                if (balance >= 300) return "🐼 Panda";
                  if (balance >= 150) return "🐺 Wolf";
                    if (balance >= 50) return "🐹 Hamster";
                      return "🐥 Chicken";
}

// 🏆 Load Top 10 Users
const leaderboardList = document.getElementById("leaderboardList");

async function loadTopUsers() {
      try {
              const q = query(collection(db, "users"), orderBy("trustScore", "desc"), limit(10));
                  const snapshot = await getDocs(q);

                      if (snapshot.empty) {
                                leaderboardList.innerHTML = "<p>No users found.</p>";
                                      return;
                      }

                          leaderboardList.innerHTML = ""; // Clear loading text

                              let rank = 1;

                                  snapshot.forEach(doc => {
                                            const user = doc.data();
                                                  const item = document.createElement("div");
                                                        item.className = "leaderboard-item";
                                                              item.innerHTML = `
                                                                      <span>#${rank++}</span>
                                                                              <img src="${user.avatar || '/assets/avatars/default.png'}" class="leaderboard-avatar" />
                                                                                      <div>
                                                                                                <strong>${user.username || "Unnamed"}</strong>
                                                                                                          <p>Score: ${user.trustScore || 0} - ${trustBadge(user.trustScore)}</p>
                                                                                                                    <p>Level: ${miningLevel(user.balance)}</p>
                                                                                                                            </div>
                                                                                                                                  `;
                                                                                                                                        leaderboardList.appendChild(item);
                                  });

      } catch (error) {
              leaderboardList.innerHTML = "<p>Error loading leaderboard.</p>";
                  console.error("Leaderboard error:", error);
      }
}

loadTopUsers();
