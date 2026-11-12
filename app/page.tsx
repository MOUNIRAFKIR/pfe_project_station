'use client'

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
        <div style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", boxSizing: "border-box", color: "#1f2937", background: "radial-gradient(circle at 15% 10%, rgba(255,102,0,0.10), transparent 45%), radial-gradient(circle at 85% 90%, rgba(255,102,0,0.06), transparent 40%), #f6f5f2", fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" }}>
            <div style={{ display: "flex", flexWrap: "wrap", width: "100%", maxWidth: "1080px", background: "#ffffff", borderRadius: "24px", overflow: "hidden", border: "1px solid #e8e6e0", boxShadow: "0 30px 70px -30px rgba(31, 41, 55, 0.25)" }}>

                <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "24px", padding: "36px", background: "linear-gradient(160deg, #ffffff 0%, #f7f5f0 100%)", borderRight: "1px solid #ece9e2" }}>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

                        <div style={{ lineHeight: 1.1, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                            <span style={{ display: "block", fontSize: "22px", fontWeight: 700, color: "#ff6600" }}>Flux</span>
                            <span style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.18em", color: "#9a9488", fontStyle: "normal", textTransform: "uppercase" }}>Parking Map</span>
                        </div>
                    </div>

                    <div>
                        <h1 style={{ margin: 0, fontSize: "32px", lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 800, color: "#1f2937" }}>
                            Find your perfect <span style={{ color: "#ff6600" }}>parking spot.</span>
                        </h1>
                        <p style={{ margin: "12px 0 0", fontSize: "14px", lineHeight: 1.6, color: "#6b7280", maxWidth: "380px" }}>
                            Discover live availability, compare prices, and reserve your space before you arrive.
                        </p>
                    </div>

                    <svg viewBox="0 0 460 300" aria-label="Parking map preview" style={{ width: "100%", height: "auto", display: "block", borderRadius: "16px", border: "1px solid #e6e3db", background: "#f2efe8" }}>
                        <defs>
                            <pattern id="parkingGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M20 0H0V20" fill="none" stroke="#e6e2d8" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="460" height="300" fill="url(#parkingGrid)" />

                        <path d="M0 90H460" stroke="#e0ddd3" strokeWidth="34" />
                        <path d="M0 210H460" stroke="#e0ddd3" strokeWidth="34" />
                        <path d="M150 0V300" stroke="#e0ddd3" strokeWidth="30" />
                        <path d="M330 0V300" stroke="#e0ddd3" strokeWidth="30" />

                        <path d="M0 90H460" stroke="#cfcbbf" strokeWidth="2" strokeDasharray="10 10" />
                        <path d="M0 210H460" stroke="#cfcbbf" strokeWidth="2" strokeDasharray="10 10" />
                        <path d="M150 0V300" stroke="#cfcbbf" strokeWidth="2" strokeDasharray="10 10" />
                        <path d="M330 0V300" stroke="#cfcbbf" strokeWidth="2" strokeDasharray="10 10" />

                        <rect x="30" y="30" width="90" height="40" rx="6" fill="#e9e5db" stroke="#dcd7cb" />
                        <rect x="360" y="230" width="70" height="40" rx="6" fill="#e9e5db" stroke="#dcd7cb" />
                        <rect x="180" y="230" width="120" height="40" rx="6" fill="#e9e5db" stroke="#dcd7cb" />

                        <g stroke="#b9b3a5" strokeWidth="2">
                            <line x1="24" y1="118" x2="148" y2="118" />
                            <line x1="24" y1="190" x2="148" y2="190" />
                            <line x1="24" y1="118" x2="24" y2="190" />
                            <line x1="55" y1="118" x2="55" y2="190" />
                            <line x1="86" y1="118" x2="86" y2="190" />
                            <line x1="117" y1="118" x2="117" y2="190" />
                            <line x1="148" y1="118" x2="148" y2="190" />
                        </g>
                        <rect x="89" y="122" width="25" height="64" rx="4" fill="#ff6600" opacity="0.16" stroke="#ff6600" />
                        <rect x="94" y="132" width="15" height="44" rx="4" fill="#ff6600" opacity="0.9" />

                        <g stroke="#b9b3a5" strokeWidth="2">
                            <line x1="312" y1="118" x2="436" y2="118" />
                            <line x1="312" y1="190" x2="436" y2="190" />
                            <line x1="312" y1="118" x2="312" y2="190" />
                            <line x1="343" y1="118" x2="343" y2="190" />
                            <line x1="374" y1="118" x2="374" y2="190" />
                            <line x1="405" y1="118" x2="405" y2="190" />
                            <line x1="436" y1="118" x2="436" y2="190" />
                        </g>
                        <rect x="377" y="122" width="25" height="64" rx="4" fill="#22c55e" opacity="0.14" stroke="#22c55e" />

                        <path d="M96 210H150V90H330V48" stroke="#ff6600" strokeWidth="4" strokeDasharray="9 9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="330" cy="48" r="22" fill="#ff6600" opacity="0.16" />
                        <path d="M330 30c-8 0-14 6-14 14 0 10 14 24 14 24s14-14 14-24c0-8-6-14-14-14z" fill="#ff6600" />
                        <circle cx="330" cy="44" r="5" fill="#ffffff" />

                        <rect x="64" y="203" width="30" height="14" rx="4" fill="#4b5563" />
                        <circle cx="71" cy="219" r="3" fill="#1f2937" />
                        <circle cx="87" cy="219" r="3" fill="#1f2937" />
                    </svg>

                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        {[
                            { value: "120+", label: "Spots nearby" },
                            { value: "Live", label: "Availability" },
                            { value: "2 min", label: "To book" },
                        ].map((stat) => (
                            <div key={stat.label} style={{ flex: "1 1 90px", padding: "10px 12px", background: "#ffffff", border: "1px solid #ece9e2", borderRadius: "12px", boxShadow: "0 4px 10px -6px rgba(31, 41, 55, 0.12)" }}>
                                <span style={{ display: "block", fontSize: "16px", fontWeight: 700, color: "#ff6600" }}>{stat.value}</span>
                                <span style={{ display: "block", marginTop: "2px", fontSize: "11px", letterSpacing: "0.04em", color: "#8a8478" }}>{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px", background: "#ffffff" }}>
                    <div style={{ width: "100%", maxWidth: "368px", margin: "0 auto" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "20px", padding: "6px 12px", borderRadius: "9999px", background: "rgba(255, 102, 0, 0.10)", border: "1px solid rgba(255, 102, 0, 0.30)", color: "#c24f00", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                            <span style={{ width: "7px", height: "7px", borderRadius: "9999px", background: "#ff6600", display: "inline-block" }} />
                            Flux Parking
                        </div>

                        <div style={{ marginBottom: "28px" }}>
                            <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", color: "#1f2937" }}>
                                Sign In
                            </h2>
                            <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#6b7280" }}>
                                Access your parking dashboard and reserved spots.
                            </p>
                        </div>

                        <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                            <div>
                                <label htmlFor="email" style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.02em", color: "#374151" }}>
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", fontSize: "14px", color: "#111827", background: "#faf9f6", border: "1px solid #e2dfd7", borderRadius: "12px", outline: "none" }}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.02em", color: "#374151" }}>
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", fontSize: "14px", color: "#111827", background: "#faf9f6", border: "1px solid #e2dfd7", borderRadius: "12px", outline: "none" }}
                                />
                            </div>

                            {message.error && (
                                <p role="alert" style={{ margin: 0, padding: "8px 12px", fontSize: "14px", lineHeight: 1.35, color: "#dc2626", background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "8px" }}>{message.error}</p>
                            )}
                            {message.success && (
                                <p role="status" style={{ margin: 0, padding: "8px 12px", fontSize: "14px", lineHeight: 1.35, color: "#16a34a", background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "8px" }}>{message.success}</p>
                            )}

                            <button
                                type="submit"
                                style={{ marginTop: "4px", width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px 16px", fontSize: "14px", fontWeight: 700, color: "#ffffff", background: "#ff6600", border: "none", borderRadius: "12px", cursor: "pointer", boxShadow: "0 12px 24px -10px rgba(255, 102, 0, 0.75)", transition: "background-color 0.2s ease, box-shadow 0.2s ease" }}
                            >
                                Log In
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </form>

                        <p style={{ margin: "28px 0 0", textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
                            Don&apos;t have an account?{" "}
                            <Link href="/signUp" style={{ color: "#ff6600", fontWeight: 600, textDecoration: "none" }}>
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
