// routes/game.js
import express from "express";
import { db } from "../firebase-admin.js";

const router = express.Router();

router.post("/submit-score", async (req, res) => {
  const { uid, score } = req.body;

  if (!uid || typeof score !== "number") {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const userRef = db.collection("users").doc(uid);
    await userRef.update({ gameScore: score }); // Or .set({ gameScore: score }, { merge: true })
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save score" });
  }
});

export default router;
