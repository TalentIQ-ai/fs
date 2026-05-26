// talentiq-api/src/controllers/auth.controller.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// nodemailer diimport secara dynamic agar tidak error jika belum install
// jalankan: pnpm add nodemailer && pnpm add -D @types/nodemailer
import * as nodemailer from "nodemailer";

// Import PrismaClient langsung dari generated — fix error "Property 'user' does not exist"
import { PrismaClient } from "../../generated/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// ── Helper: kirim email ────────────────────────────────────────────────────────
const sendEmail = async (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: `"TalentIQ AI" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    });
};

// ── Helper: generate JWT ───────────────────────────────────────────────────────
const generateToken = (userId: number) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET as string,
        { expiresIn: (process.env.JWT_EXPIRES_IN as any) || "7d" }
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER
// POST /api/auth/register
// Body: { name, email, password, confirmPassword }
// ─────────────────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Semua field wajib diisi" });
        }

        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({ message: "Password tidak cocok" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password minimal 6 karakter" });
        }

        const userExist = await prisma.user.findUnique({ where: { email } });
        if (userExist) {
            return res.status(400).json({ message: "Email sudah digunakan" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
            select: { id: true, name: true, email: true, createdAt: true },
        });

        const token = generateToken(user.id);

        return res.status(201).json({ message: "Register berhasil", token, user });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Server Error", error });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// POST /api/auth/login
// Body: { email, password }
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email dan password wajib diisi" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Email atau password salah" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email atau password salah" });
        }

        const token = generateToken(user.id);

        // Hapus field sensitif sebelum dikirim ke client
        const { password: _pw, resetToken: _rt, resetTokenExpiry: _re, ...safeUser } = user;

        return res.json({ message: "Login berhasil", token, user: safeUser });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server Error", error });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// Body: { email }
// ─────────────────────────────────────────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email wajib diisi" });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        // Selalu return 200 meski email tidak ada (keamanan)
        if (!user) {
            return res.json({ message: "Jika email terdaftar, link reset telah dikirim" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

        await prisma.user.update({
            where: { email },
            data: { resetToken, resetTokenExpiry },
        });

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

        const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; border-radius: 12px;">
        <div style="background: linear-gradient(135deg, #025CB8, #62AAEA); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">TalentIQ AI</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Reset Password</p>
        </div>
        <div style="background: white; padding: 32px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #111827; margin-top: 0;">Halo, ${user.name}!</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            Kami menerima permintaan untuk mereset password akun TalentIQ AI kamu.
            Klik tombol di bawah untuk membuat password baru.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}"
               style="background: #025CB8; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 13px; line-height: 1.6;">
            Link ini akan kadaluarsa dalam <strong>1 jam</strong>.<br/>
            Jika kamu tidak meminta reset password, abaikan email ini.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;"/>
          <p style="color: #d1d5db; font-size: 12px; text-align: center;">
            © 2026 TalentIQ AI. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    `;

        await sendEmail(email, "Reset Password TalentIQ AI", emailHtml);

        return res.json({ message: "Jika email terdaftar, link reset telah dikirim" });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ message: "Server Error", error });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// RESET PASSWORD
// POST /api/auth/reset-password
// Body: { token, email, newPassword, confirmPassword }
// ─────────────────────────────────────────────────────────────────────────────
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, email, newPassword, confirmPassword } = req.body;

        if (!token || !email || !newPassword) {
            return res.status(400).json({ message: "Semua field wajib diisi" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Password tidak cocok" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password minimal 6 karakter" });
        }

        const user = await prisma.user.findFirst({
            where: {
                email,
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({
                message: "Token tidak valid atau sudah kadaluarsa. Minta link baru.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return res.json({ message: "Password berhasil direset. Silakan login." });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ message: "Server Error", error });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET PROFILE (Protected)
// GET /api/auth/me
// Header: Authorization: Bearer <token>
// ─────────────────────────────────────────────────────────────────────────────
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true, createdAt: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        return res.json({ user });
    } catch (error) {
        console.error("Get me error:", error);
        return res.status(500).json({ message: "Server Error", error });
    }
};