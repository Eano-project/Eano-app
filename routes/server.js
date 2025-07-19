// server.js
import express from "express";
import cors from "cors";
import gameRoutes from "./routes/game.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/game", gameRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎮 Game server running on port ${PORT}`);
});
