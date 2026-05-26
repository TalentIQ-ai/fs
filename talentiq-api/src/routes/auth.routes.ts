// talentiq-api/src/routes/auth.routes.ts
import { Router } from "express";
import {
    register,
    login,
    forgotPassword,
    resetPassword,
    getMe,
} from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

// ── Public Routes ─────────────────────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ── Protected Routes (butuh token) ────────────────────────────────────────────
router.get("/me", verifyToken, getMe);

export default router;