'use server'

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import "dotenv/config";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


const secretString = process.env.JWT_SECRET || "fallback_emergency_secret_key_32_chars_long";
const SECRET_KEY = new TextEncoder().encode(secretString);

export async function signUp(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) return { error: "All fields are required" };

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "User already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: { name , email, password: hashedPassword},
    });

    return { success: "Account created successfully! Please login." };
}

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return { error: "All fields are required" };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Invalid credentials" };

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return { error: "Invalid credentials" };

    const token = await new SignJWT({ userId: user.id, email: user.email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(SECRET_KEY);

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
    });

    redirect("/home");
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/");
}

export async function getAuthUserId(): Promise<string> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("session")?.value;

        if (!sessionToken) {
            return "";
        }

        const { payload } = await jwtVerify(sessionToken, SECRET_KEY);

        return (payload.userId as string) || "";
    } catch (error) {
        console.error("JWT verification failed:", error);
        return "";
    }
}