import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const userExist = await prisma.user.findUnique({
            where: { email },
        });

        if (userExist) {
            return res.status(400).json({
                message: "Email sudah digunakan",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            message: "Register berhasil",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error,
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({
                message: "User tidak ditemukan",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Password salah",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "7d",
            }
        );

        res.json({
            message: "Login berhasil",
            token,
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error,
        });
    }
};

export const forgotPassword = async (
    req: Request,
    res: Response
) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({
                message: "Email tidak ditemukan",
            });
        }

        res.json({
            message:
                "Fitur forgot password berhasil dipanggil",
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error,
        });
    }
};