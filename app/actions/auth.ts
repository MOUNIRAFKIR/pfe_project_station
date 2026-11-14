'use server'

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


let cachedSecret: Uint8Array | null = null;
function getSecretKey() {
    if (cachedSecret) return cachedSecret;

    const secretString = process.env.JWT_SECRET;
    if (!secretString) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("JWT_SECRET is not set");
        }
        console.warn("JWT_SECRET is not set; using an insecure development secret.");
        cachedSecret = new TextEncoder().encode("dev_only_insecure_secret_change_me");
    } else {
        cachedSecret = new TextEncoder().encode(secretString);
    }

    return cachedSecret;
}

export async function signUp(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!name || !email || !password) return { error: "All fields are required" };
    if (password.length < 6) return { error: "Password must be at least 6 characters" };

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "User already exists" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: { name , email, password: hashedPassword},
    });

    return { success: "Account created successfully! Please login." };
}

export async function login(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) return { error: "All fields are required" };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Invalid credentials" };

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return { error: "Invalid credentials" };

    const token = await new SignJWT({ userId: user.id, email: user.email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(getSecretKey());

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

        const { payload } = await jwtVerify(sessionToken, getSecretKey());

        return (payload.userId as string) || "";
    } catch (error) {
        console.error("JWT verification failed:", error);
        return "";
    }
}

export async function GetLocalisation() {
    const parkings = await prisma.parking.findMany({
        where: {
                latitude: { not: null },
                longitude: { not: null }
        },orderBy: { name: "asc" },
            select: {
                        id: true,
                        name: true,
                        address: true,
                        totalSpots: true,
                        pricePerHour: true,
                        latitude: true,
                        longitude: true
            },
        });
    return parkings;
}
