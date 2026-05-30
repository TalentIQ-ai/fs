// talentiq-api/src/routes/profile.routes.ts
import { Router } from "express";
import {
    getProfile,
    updateProfile,
    updateStats,
} from "../controllers/profile.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

// Semua route profil butuh token
router.use(verifyToken);

router.get("/", getProfile);    // GET   /api/profile
router.put("/", updateProfile); // PUT   /api/profile
router.patch("/stats", updateStats);   // PATCH /api/profile/stats

export default router; // ← fix: tambahkan default export