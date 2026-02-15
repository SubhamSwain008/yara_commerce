"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowRight, Heart, Truck, Check, RefreshCw ,LockIcon} from "lucide-react";
import { useState } from "react";

/* ═══════════════════════════════════════════════════════════
   SRINIBAS VASTRA — SITE FOOTER
   Heritage-inspired premium footer with warm brown palette
   ═══════════════════════════════════════════════════════════ */

const QUICK_LINKS = [
    { label: "Home", href: "/home" },
    { label: "Products", href: "/products" },
    { label: "Sarees", href: "/products?category=saree" },
    { label: "Lehengas", href: "/products?category=lehenga" },
    { label: "Dupattas", href: "/products?category=dupatta" },
];

const CUSTOMER_SERVICE = [
    { label: "My Orders", href: "/orders" },
    { label: "My Cart", href: "/cart" },
    { label: "My Profile", href: "/profile" },
    { label: "Become a Seller", href: "/profile/applyForSeller" },
];

const POLICIES = [
    { label: "Shipping Policy", href: "#" },
    { label: "Return & Refund", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
];

const SOCIAL_LINKS = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer style={{ backgroundColor: "var(--color-bg-dark)", color: "var(--color-text-light)" }}>
            {/* ─── Newsletter Banner ─── */}
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[#C88912] py-10 px-6">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 min-w-[300px] text-center md:text-left">
                        <h3 className="text-2xl font-extrabold text-[var(--color-bg-dark)] mb-1">
                            Stay Updated
                        </h3>
                        <p className="text-sm text-[rgba(43,26,18,0.7)]">
                            Subscribe for exclusive offers, new collections & artisan stories
                        </p>
                    </div>
                    <form
                        onSubmit={handleSubscribe}
                        className="flex-1 w-full md:w-auto flex flex-col sm:flex-row gap-2 max-w-[440px]"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 py-3 px-4 rounded-xl border-none text-sm bg-[rgba(255,255,255,0.9)] text-[var(--color-bg-dark)] outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-[var(--color-bg-dark)]/20 transition-all"
                        />
                        <button
                            type="submit"
                            className="py-3 px-6 rounded-xl border-none bg-[var(--color-bg-dark)] text-[var(--color-primary)] font-bold text-sm cursor-pointer flex items-center justify-center gap-1.5 transition-all hover:bg-black/90 active:scale-95 whitespace-nowrap"
                        >
                            {subscribed ? "Subscribed ✓" : <>Subscribe <ArrowRight size={14} /></>}
                        </button>
                    </form>
                </div>
            </div>

            {/* ─── Main Footer Grid ─── */}
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 32px" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 40,
                    }}
                >
                    {/* Column 1: Brand + Contact */}
                    <div>
                        <h2
                            style={{
                                fontSize: 22,
                                fontWeight: 800,
                                color: "var(--color-primary)",
                                marginBottom: 12,
                                letterSpacing: "0.5px",
                            }}
                        >
                            want to build similar website?
                        </h2>
                        <p
                            style={{
                                fontSize: 13,
                                lineHeight: 1.7,
                                color: "var(--color-text-muted)",
                                marginBottom: 20,
                            }}
                        >
                            to build similar website contact me at the email/number below.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <a
                                href="tel:+919876543210"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    fontSize: 13,
                                    color: "var(--color-text-muted)",
                                    textDecoration: "none",
                                    transition: "color 0.2s",
                                    backgroundColor: "var(--color-bg-light)",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                            >
                                <Phone size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                                +91 8117032137
                            </a>
                            <a
                                href="mailto:subhamswain8456@gmail.com"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    fontSize: 13,
                                    color: "var(--color-text-muted)",
                                    textDecoration: "none",
                                    transition: "color 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                            >
                                <Mail size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                                subhamswain8456@gmail.com
                            </a>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 10,
                                    fontSize: 13,
                                    color: "var(--color-text-muted)",
                                }}
                            >
                                <MapPin size={14} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: 2 }} />
                                <span>Berhampur, Odisha, India - 760001</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                color: "var(--color-primary)",
                                marginBottom: 20,
                            }}
                        >
                            Quick Links
                        </h4>
                        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {QUICK_LINKS.map((link) => (
                                <Link
                                    key={link.href + link.label}
                                    href={link.href}
                                    style={{
                                        fontSize: 13,
                                        color: "var(--color-text-muted)",
                                        textDecoration: "none",
                                        transition: "all 0.2s",
                                        paddingLeft: 0,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "var(--color-primary)";
                                        e.currentTarget.style.paddingLeft = "6px";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "var(--color-text-muted)";
                                        e.currentTarget.style.paddingLeft = "0px";
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Column 3: Customer Service */}
                    <div>
                        <h4
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                color: "var(--color-primary)",
                                marginBottom: 20,
                            }}
                        >
                            My Account
                        </h4>
                        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {CUSTOMER_SERVICE.map((link) => (
                                <Link
                                    key={link.href + link.label}
                                    href={link.href}
                                    style={{
                                        fontSize: 13,
                                        color: "var(--color-text-muted)",
                                        textDecoration: "none",
                                        transition: "all 0.2s",
                                        paddingLeft: 0,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "var(--color-primary)";
                                        e.currentTarget.style.paddingLeft = "6px";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "var(--color-text-muted)";
                                        e.currentTarget.style.paddingLeft = "0px";
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Column 4: Policies + Social */}
                    <div>
                        <h4
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                color: "var(--color-primary)",
                                marginBottom: 20,
                            }}
                        >
                            Information
                        </h4>
                        <nav style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                            {POLICIES.map((link) => (
                                <Link
                                    key={link.href + link.label}
                                    href={link.href}
                                    style={{
                                        fontSize: 13,
                                        color: "var(--color-text-muted)",
                                        textDecoration: "none",
                                        transition: "all 0.2s",
                                        paddingLeft: 0,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "var(--color-primary)";
                                        e.currentTarget.style.paddingLeft = "6px";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "var(--color-text-muted)";
                                        e.currentTarget.style.paddingLeft = "0px";
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Social Icons */}
                        <h4
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                color: "var(--color-primary)",
                                marginBottom: 12,
                            }}
                        >
                            Follow Us
                        </h4>
                        <div style={{ display: "flex", gap: 10 }}>
                            {SOCIAL_LINKS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: 10,
                                        backgroundColor: "rgba(224,161,27,0.1)",
                                        border: "1px solid rgba(224,161,27,0.15)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "var(--color-primary)",
                                        transition: "all 0.2s",
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "var(--color-primary)";
                                        e.currentTarget.style.color = "var(--color-bg-dark)";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "rgba(224,161,27,0.1)";
                                        e.currentTarget.style.color = "var(--color-primary)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    <s.icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Trust Bar ─── */}
            <div
                style={{
                    borderTop: "1px solid rgba(224,161,27,0.1)",
                    borderBottom: "1px solid rgba(224,161,27,0.1)",
                    padding: "20px 24px",
                }}
            >
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 32,
                    }}
                >
                    {[
                        { emoji: <Truck size={16} />, text: "Free Shipping on ₹999+" },
                        { emoji: <LockIcon size={16} />, text: "Secure Payments" },
                        { emoji: <Check size={16} />, text: "100% Authentic Handloom" },
                        { emoji: <RefreshCw size={16} />, text: "Easy Returns & Exchange" },
                    ].map((item) => (
                        <div
                            key={item.text}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: 12,
                                color: "var(--color-text-muted)",
                                fontWeight: 600,
                            }}
                        >
                            <span style={{ fontSize: 16 }}>{item.emoji}</span>
                            {item.text}
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── Bottom Bar ─── */}
            <div style={{ padding: "20px 24px" }}>
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <p style={{ fontSize: 12, color: "rgba(245,230,200,0.5)" }}>
                        © {new Date().getFullYear()} Srinibas Vastra. All rights reserved.
                    </p>
                    <p
                        style={{
                            fontSize: 12,
                            color: "rgba(245,230,200,0.5)",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        Crafted with <Heart size={11} style={{ color: "var(--color-secondary)", fill: "var(--color-secondary)" }} /> in India
                    </p>
                </div>
            </div>
        </footer>
    );
}
