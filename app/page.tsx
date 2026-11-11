'use client'

<<<<<<< HEAD
import { login } from "@/app/actions/auth";
import React, { useState } from "react";
import Link from "next/link";


export default function LoginPage() {
    const [message, setMessage] = useState<{ error?: string; success?: string }>({});

    async function handleSubmit(formData: FormData) {
        setMessage({});
        const res = await login(formData);
        setMessage(res);
    }

    return (
        <div style={{display: "flex", justifyContent: "center",alignItems: "center",flexDirection:"row",height:"100vh",backgroundColor:"#FCFCFC"}}>


            <div style={{height:"85vh"}}>
                <img className="hidden md:block" src="/Logo.png" style={{width:'60px',height:'60px'}}/>
            </div>
            <div style={{display: "flex", justifyContent: "center",alignItems: "center",flexDirection:"column",gap:"2px"}}>
                <span className="hidden md:block" style={{fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: "bold", letterSpacing: "0.025em", fontStyle: "italic", paddingLeft: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",}}>
                    Welcome To
                </span>
                <span className="hidden md:block" style={{fontFamily: "Georgia, serif", fontSize: "30px", fontWeight: "bold", letterSpacing: "0.025em", fontStyle: "italic", paddingLeft: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",color:"#4361ee"}}>
                    Flux
                </span>
                <img src="/LogInPic.jpg" style={{width:'70vh',height:'60%'}} className="hidden md:block"/>
            </div>

            <div style={{ width: '450px', backgroundColor: '#ffffff', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}>
                <h2 style={{ textAlign: 'center', fontSize: '1.5rem', lineHeight: '2rem', fontWeight: 700, color: '#1f2937' }}>
                    Sign In
                </h2>

                <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 500, color: '#374151' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            style={{
                                marginTop: '0.25rem',
                                width: '100%',
                                borderRadius: '0.25rem',
                                border: '1px solid #d1d5db',
                                padding: '0.5rem',
                                color: '#000000',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}/>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 500, color: '#374151' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            style={{
                                marginTop: '0.25rem',
                                width: '100%',
                                borderRadius: '0.25rem',
                                border: '1px solid #d1d5db',
                                padding: '0.5rem',
                                color: '#000000',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}/>
                    </div>

                    {message.error && (
                        <p style={{ fontSize: '0.875rem', lineHeight: '1.25rem', color: '#ef4444', margin: 0 }}>{message.error}</p>
                    )}
                    {message.success && (
                        <p style={{ fontSize: '0.875rem', lineHeight: '1.25rem', color: '#22c55e', margin: 0 }}>{message.success}</p>
                    )}

                    <button type="submit"
                            style={{
                                width: '100%',
                                borderRadius: '0.25rem',
                                backgroundColor: '#2563eb',
                                padding: '0.5rem',
                                fontWeight: 600,
                                color: '#ffffff',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)'
                            }}>
                        Log In
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.875rem', lineHeight: '1.25rem', color: '#4b5563', marginTop: '1rem' }}>
                    Don't have an account?{" "}
                    <Link href="/signUp" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                        Sign Up
                    </Link>
                </p>
            </div>
=======
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert h-5 w-[100px]"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">

            <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
              page.tsx
            </code>{" "}
            file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
>>>>>>> bd88d94b3c22de3b969861d38f605cc4b4dfd1e2
        </div>
    );
}