// talentiq-api/src/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
    res.json({ message: "TalentIQ API Running ✅", version: "1.0.0" });
});

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ message: "Route tidak ditemukan" });
});

// ── Start Server ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});