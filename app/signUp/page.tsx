'use client'

import { signUp } from "@/app/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
    const [message, setMessage] = useState<{ error?: string; success?: string }>({});
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setMessage({});
        const res = await signUp(formData);
        setMessage(res);

        if (res.success) {
            setTimeout(() => {
                router.push("/");
            }, 1500);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
                <h2 className="text-center text-2xl font-bold text-gray-800">
                    Create an Account
                </h2>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="mt-1 w-full rounded border p-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="mt-1 w-full rounded border p-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="mt-1 w-full rounded border p-2 text-black outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {message.error && <p className="text-sm text-red-500">{message.error}</p>}
                    {message.success && <p className="text-sm text-green-500">{message.success}</p>}

                    <button
                        type="submit"
                        className="w-full rounded bg-blue-600 p-2 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/" className="text-blue-600 underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}