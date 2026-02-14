"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "./navbar";
import Link from "next/link";
import Image from "next/image";
import { Home, ShoppingBag, LogIn, UserPlus } from "lucide-react";

export default function ClientAuthNavbar({
    initialAuthenticated,
}: {
    initialAuthenticated: boolean;
}) {
    const [authenticated, setAuthenticated] = useState<boolean>(initialAuthenticated);

    useEffect(() => {
        const supabase = createClient();

        // ensure initial client-side state matches actual session
        supabase.auth.getUser().then(({ data }) => setAuthenticated(Boolean(data?.user)));

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthenticated(Boolean(session?.user));
        });

        return () => {
            // unsubscribe listener when component unmounts
            try {
                listener?.subscription?.unsubscribe?.();
            } catch { }
        };
    }, []);

    if (authenticated) return <Navbar />;

    // ── Slim public navbar for non-authenticated users ──
    return (
        <header
            style={{
                width: "100%",
                backgroundColor: "var(--color-bg-dark)",
                borderBottom: "2px solid var(--color-border)",
            }}
        >
            <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

                {/* Logo */}
                <Link href="/" style={{ position: "relative", height: 50, width: 180, display: "block" }}>
                    <Image
                        src="/logo.png"
                        alt="Srinibas Vastra"
                        fill
                        priority
                        sizes="180px"
                        style={{ objectFit: "contain" }}
                    />
                </Link>

                {/* Nav Links */}
                <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <PublicNavLink href="/home" icon={<Home size={16} />}>Home</PublicNavLink>
                    <PublicNavLink href="/products" icon={<ShoppingBag size={16} />}>Products</PublicNavLink>

                    <div style={{ width: 1, height: 24, backgroundColor: "rgba(224,161,27,0.2)", margin: "0 8px" }} />

                    <Link
                        href="/login"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "8px 18px", borderRadius: 8,
                            border: "1px solid rgba(224,161,27,0.3)", backgroundColor: "transparent",
                            color: "var(--color-text-muted)", fontSize: 13, fontWeight: 600,
                            textDecoration: "none", transition: "all .2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.color = "var(--color-primary)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(224,161,27,0.3)"; e.currentTarget.style.color = "var(--color-text-muted)"; }}
                    >
                        <LogIn size={14} /> Login
                    </Link>
                    <Link
                        href="/signup"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "8px 18px", borderRadius: 8,
                            border: "none", backgroundColor: "var(--color-primary)",
                            color: "var(--color-bg-dark)", fontSize: 13, fontWeight: 700,
                            textDecoration: "none", transition: "all .2s",
                            boxShadow: "0 2px 10px rgba(224,161,27,0.25)",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                        <UserPlus size={14} /> Sign Up
                    </Link>
                </nav>
            </div>
        </header>
    );
}

function PublicNavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 8,
                color: "var(--color-text-muted)", fontSize: 13, fontWeight: 600,
                textDecoration: "none", transition: "all .2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-primary)"; e.currentTarget.style.backgroundColor = "rgba(224,161,27,0.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-muted)"; e.currentTarget.style.backgroundColor = "transparent"; }}
        >
            {icon} {children}
        </Link>
    );
}
