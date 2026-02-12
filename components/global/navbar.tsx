"use client";

import Image from "next/image";
import { Home, ShoppingBag, Info, Phone, ShoppingCart, User, List, HomeIcon, Package } from 'lucide-react';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
    const router = useRouter();
    const supabase = createClient();
    const [open, setOpen] = useState(false);

    async function handleLogout() {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            router.push("/login");
        }
    }

    return (
        <header
            className="w-full"
            style={{
                backgroundColor: "var(--color-bg-dark)",
                borderBottom: "2px solid var(--color-border)",
            }}
        >
            <div className="w-full px-4 sm:px-6 lg:px-8">
                {/* Increased navbar height */}
                <div className="flex items-center justify-between h-32">

                    {/* Logo */}
                    <a href="/" className="relative flex items-center">
                        <div
                            style={{
                                position: "relative",
                                height: 120,
                                width: 400,
                                maxWidth: '60vw'
                            }}
                        >
                            <Image
                                src="/logo.png"
                                alt="Srinibas Vastra"
                                fill
                                priority
                                sizes="(max-width: 768px) 240px, 420px"
                                style={{ objectFit: "contain" }}
                            />
                        </div>
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <NavLink href="/home" Icon={Home}>Home</NavLink>
                        <NavLink href="/products" Icon={ShoppingBag}>Products</NavLink>
                     
                        <NavLink href="/cart" Icon={ShoppingCart}>Cart</NavLink>
                        <NavLink href="/profile" Icon={User}>Profile</NavLink>
                        <NavLink href="/orders" Icon={List}>Orders</NavLink>

                        <button
                            onClick={handleLogout}
                            className="ml-6"
                            style={{
                                background: "transparent",
                                color: "var(--color-text-light)",
                                border: "1px solid var(--color-primary)",
                                padding: "6px 14px",
                                borderRadius: 8,
                                cursor: "pointer",
                                transition: "all .2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "var(--color-primary)";
                                e.currentTarget.style.color = "#2B1A12";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "var(--color-text-light)";
                            }}
                        >
                            Logout
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setOpen((s) => !s)}
                            aria-label="Toggle menu"
                            aria-expanded={open}
                            className="inline-flex items-center justify-center p-2 rounded-md"
                            style={{ color: "var(--color-text-light)" }}
                        >
                            <svg
                                className="h-8 w-8"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                {open ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div
                    className="md:hidden"
                    style={{
                        backgroundColor: "var(--color-bg-dark)",
                        borderTop: "1px solid var(--color-border)",
                    }}
                >
                    <div className="px-4 pt-4 pb-4 space-y-2">
                        <MobileLink href="/home" onClick={() => setOpen(false)} Icon={HomeIcon}>Home</MobileLink>
                        <MobileLink href="/products" onClick={() => setOpen(false)} Icon={Package}>Products</MobileLink>
                        <MobileLink href="/cart" onClick={() => setOpen(false)} Icon={ShoppingCart}>Cart</MobileLink>
                        <MobileLink href="/profile" onClick={() => setOpen(false)} Icon={User}>Profile</MobileLink>
                        <MobileLink href="/orders" onClick={() => setOpen(false)} Icon={List}>Orders</MobileLink>
                  
                        <button
                            onClick={() => {
                                setOpen(false);
                                handleLogout();
                            }}
                            className="w-full text-left py-3"
                            style={{
                                color: "var(--color-text-light)",
                                background: "transparent",
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

function NavLink({ href, children, Icon }: { href: string; children: React.ReactNode; Icon?: any }) {
    return (
        <a
            href={href}
            style={{
                color: "var(--color-text-light)",
                textDecoration: "none",
                transition: "color .2s ease",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '6px 8px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-light)")}
        >
            {Icon ? <Icon size={20} color="currentColor" /> : null}
            <span style={{ fontSize: 13, lineHeight: '1' }}>{children}</span>
        </a>
    );
}

function MobileLink({
    href,
    children,
    onClick,
    Icon,
}: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    Icon?: any;
}) {
    return (
        <a
            href={href}
            onClick={onClick}
            className="block py-3"
            style={{
                color: "var(--color-text-light)",
                textDecoration: "none",
                transition: "color .2s ease",
                display: 'flex',
                alignItems: 'center',
                gap: 8
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-light)")}
        >
            {Icon ? <Icon size={18} color="currentColor" /> : null}
            {children}
        </a>
    );
}
