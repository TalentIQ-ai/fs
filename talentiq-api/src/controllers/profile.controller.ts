// talentiq-api/src/controllers/profile.controller.ts
import { Response } from "express";

// Fix: import PrismaClient dari generated langsung — sama seperti auth.controller
import { PrismaClient } from "../../generated/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// GET PROFILE
// GET /api/profile
// Header: Authorization: Bearer <token>
// ─────────────────────────────────────────────────────────────────────────────
export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        // Ambil user + profile sekaligus via relasi Prisma
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                profile: true, // join ke tabel Profile
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        // Kalau profil belum ada, buat profil kosong otomatis
        if (!user.profile) {
            const newProfile = await prisma.profile.create({
                data: { userId: user.id },
            });
            return res.json({ user: { ...user, profile: newProfile } });
        }

        return res.json({ user });
    } catch (error) {
        console.error("Get profile error:", error);
        return res.status(500).json({ message: "Server Error", error });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE PROFILE
// PUT /api/profile
// Header: Authorization: Bearer <token>
// Body: { name, targetRole, experienceLevel, skills, avatarUrl }
// ─────────────────────────────────────────────────────────────────────────────
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, targetRole, experienceLevel, skills, avatarUrl } = req.body;

        // Validasi minimal
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Nama tidak boleh kosong" });
        }

        // Update nama di tabel User
        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: { name: name.trim() },
            select: { id: true, name: true, email: true, createdAt: true },
        });

        // Upsert Profile (update jika sudah ada, create jika belum)
        const updatedProfile = await prisma.profile.upsert({
            where: { userId: req.userId! },
            update: {
                targetRole: targetRole ?? undefined,
                experienceLevel: experienceLevel ?? undefined,
                skills: Array.isArray(skills) ? skills : undefined,
                avatarUrl: avatarUrl ?? undefined,
            },
            create: {
                userId: req.userId!,
                targetRole: targetRole ?? null,
                experienceLevel: experienceLevel ?? null,
                skills: Array.isArray(skills) ? skills : [],
                avatarUrl: avatarUrl ?? null,
            },
        });

        return res.json({
            message: "Profil berhasil diperbarui",
            user: { ...updatedUser, profile: updatedProfile },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({ message: "Server Error", error });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE STATS
// PATCH /api/profile/stats
// Header: Authorization: Bearer <token>
// Body: { activeCourses, completedCourses, totalHours, streakDays }
// ─────────────────────────────────────────────────────────────────────────────
export const updateStats = async (req: AuthRequest, res: Response) => {
    try {
        const { activeCourses, completedCourses, totalHours, streakDays } = req.body;

        const updatedProfile = await prisma.profile.upsert({
            where: { userId: req.userId! },
            update: {
                activeCourses: activeCourses ?? undefined,
                completedCourses: completedCourses ?? undefined,
                totalHours: totalHours ?? undefined,
                streakDays: streakDays ?? undefined,
            },
            create: {
                userId: req.userId!,
                activeCourses: activeCourses ?? 0,
                completedCourses: completedCourses ?? 0,
                totalHours: totalHours ?? 0,
                streakDays: streakDays ?? 0,
            },
        });

        return res.json({
            message: "Stats berhasil diperbarui",
            profile: updatedProfile,
        });
    } catch (error) {
        console.error("Update stats error:", error);
        return res.status(500).json({ message: "Server Error", error });
    }
};