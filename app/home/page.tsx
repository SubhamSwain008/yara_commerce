"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Loader2, Package, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

const formatLabel = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/* ── Category data with emojis for "Shop by Category" ── */
const CATEGORY_CARDS = [
    { value: "saree", label: "Saree", emoji: "👘" },
    { value: "lehenga", label: "Lehenga", emoji: "👗" },
    { value: "dupatta", label: "Dupatta", emoji: "🧣" },
    { value: "dress_material", label: "Dress Material", emoji: "✂️" },
    { value: "kurta", label: "Kurta", emoji: "👔" },
    { value: "raw_fabric", label: "Raw Fabric", emoji: "🧵" },
    { value: "blouse_piece", label: "Blouse Piece", emoji: "🎀" },
    { value: "stole", label: "Stole", emoji: "💫" },
];

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    mrp: number | null;
    category: string;
    fabricType: string | null;
    origin: string | null;
    images: string[];
    seller: { shopName: string | null };
    productReviews: { rating: number }[];
}

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [featured, setFeatured] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const heroRef = useRef<HTMLElement>(null);
    const patternLayerRef = useRef<HTMLDivElement>(null);
    const floatingRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const tagRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLAnchorElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [allRes, featRes] = await Promise.all([
                    axios.get("/api/products?sort=newest"),
                    axios.get("/api/products?featured=true"),
                ]);
                setProducts(allRes.data.products || []);
                setFeatured(featRes.data.products || []);
            } catch {
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    /* ── GSAP animations ── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            // ─ Floating pattern dots ─
            if (patternLayerRef.current) {
                gsap.to(patternLayerRef.current, {
                    backgroundPosition: "60px 60px",
                    duration: 20,
                    ease: "none",
                    repeat: -1,
                });
            }

            // ─ Floating decorative elements ─
            if (floatingRef.current) {
                const floaters = floatingRef.current.children;
                Array.from(floaters).forEach((el, i) => {
                    gsap.set(el, {
                        x: gsap.utils.random(-400, 400),
                        y: gsap.utils.random(-200, 200),
                        scale: gsap.utils.random(0.4, 1.2),
                        rotation: gsap.utils.random(0, 360),
                        opacity: gsap.utils.random(0.03, 0.1),
                    });
                    gsap.to(el, {
                        y: `+=${gsap.utils.random(-80, 80)}`,
                        x: `+=${gsap.utils.random(-50, 50)}`,
                        rotation: `+=${gsap.utils.random(-90, 90)}`,
                        duration: gsap.utils.random(8, 18),
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true,
                        delay: i * 0.5,
                    });
                });
            }

            // ─ Hero text entrance ─
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            if (tagRef.current) {
                tl.from(tagRef.current, { y: 30, opacity: 0, duration: 0.8 });
            }
            if (titleRef.current) {
                tl.from(titleRef.current, { y: 40, opacity: 0, duration: 0.9 }, "-=0.4");
            }
            if (dividerRef.current) {
                tl.from(dividerRef.current, { scaleX: 0, opacity: 0, duration: 0.6 }, "-=0.3");
            }
            if (subtitleRef.current) {
                tl.from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.7 }, "-=0.2");
            }
            if (ctaRef.current) {
                tl.from(ctaRef.current, { y: 20, opacity: 0, scale: 0.9, duration: 0.6 }, "-=0.2");
            }

            // ─ Subtle pulsing glow on CTA ─
            if (ctaRef.current) {
                gsap.to(ctaRef.current, {
                    boxShadow: "0 6px 35px rgba(224,161,27,0.5)",
                    duration: 1.5,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                });
            }
        }, heroRef);

        return () => ctx.revert();
    }, []);

    const avgRating = (reviews: { rating: number }[]) => {
        if (!reviews.length) return null;
        return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
    };

    return (
        <main style={{ minHeight: "100vh", backgroundColor: "var(--color-bg-light)" }}>

            {/* ══════════ HERO SECTION ══════════ */}
            <section
                ref={heroRef}
                style={{
                    background: "linear-gradient(135deg, var(--color-bg-dark) 0%, #3A2010 40%, #4A2A14 60%, var(--color-bg-card) 100%)",
                    padding: "90px 24px 80px",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Animated dot pattern layer */}
                <div
                    ref={patternLayerRef}
                    style={{
                        position: "absolute", inset: 0,
                        opacity: 0.07,
                        backgroundImage:
                            "radial-gradient(circle, var(--color-primary) 1.2px, transparent 1.2px)",
                        backgroundSize: "40px 40px",
                        backgroundPosition: "0px 0px",
                    }}
                />

                {/* Floating decorative shapes */}
                <div ref={floatingRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    {/* Paisley / mandala shapes as SVGs */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                width: i % 3 === 0 ? 80 : i % 3 === 1 ? 50 : 35,
                                height: i % 3 === 0 ? 80 : i % 3 === 1 ? 50 : 35,
                            }}
                        >
                            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                                {i % 4 === 0 ? (
                                    /* Diamond */
                                    <path d="M50 5 L95 50 L50 95 L5 50 Z" stroke="var(--color-primary)" strokeWidth="2" fill="none" />
                                ) : i % 4 === 1 ? (
                                    /* Circle with inner pattern */
                                    <>
                                        <circle cx="50" cy="50" r="40" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" />
                                        <circle cx="50" cy="50" r="25" stroke="var(--color-primary)" strokeWidth="1" fill="none" />
                                        <circle cx="50" cy="50" r="10" stroke="var(--color-primary)" strokeWidth="0.8" fill="none" />
                                    </>
                                ) : i % 4 === 2 ? (
                                    /* Lotus / flower */
                                    <g stroke="var(--color-primary)" strokeWidth="1.2" fill="none">
                                        <ellipse cx="50" cy="35" rx="12" ry="25" />
                                        <ellipse cx="50" cy="35" rx="12" ry="25" transform="rotate(60 50 50)" />
                                        <ellipse cx="50" cy="35" rx="12" ry="25" transform="rotate(120 50 50)" />
                                    </g>
                                ) : (
                                    /* Star pattern */
                                    <polygon
                                        points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35"
                                        stroke="var(--color-primary)" strokeWidth="1.2" fill="none"
                                    />
                                )}
                            </svg>
                        </div>
                    ))}
                </div>

                {/* Warm radial glow */}
                <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600, height: 600,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(224,161,27,0.08) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                {/* Hero content */}
                <div style={{ position: "relative", zIndex: 2 }}>
                    <p
                        ref={tagRef}
                        style={{
                            color: "var(--color-primary)",
                            fontSize: "0.8rem",
                            letterSpacing: "4px",
                            textTransform: "uppercase",
                            marginBottom: 20,
                            fontWeight: 500,
                        }}
                    >
                        ✦ Handcrafted with Heritage ✦
                    </p>

                    <h1
                        ref={titleRef}
                        style={{
                            color: "var(--color-primary)",
                            fontSize: "clamp(2.2rem, 6vw, 3.6rem)",
                            fontWeight: 700,
                            marginBottom: 20,
                            lineHeight: 1.15,
                            textShadow: "0 2px 20px rgba(224,161,27,0.2)",
                        }}
                    >
                        Srinibas Vastra
                    </h1>

                    {/* Decorative divider */}
                    <div
                        ref={dividerRef}
                        style={{
                            width: 60, height: 3,
                            backgroundColor: "var(--color-primary)",
                            margin: "0 auto 20px",
                            borderRadius: 2,
                        }}
                    />

                    <p
                        ref={subtitleRef}
                        style={{
                            color: "var(--color-text-muted)",
                            fontSize: "1.05rem",
                            maxWidth: 520,
                            margin: "0 auto 36px",
                            lineHeight: 1.7,
                        }}
                    >
                        Where Tradition Meets Trend. Curated Sarees &amp; Fashion for Every Occasion.
                    </p>

                    <Link
                        href="/products"
                        ref={ctaRef}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "14px 36px",
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-bg-dark)",
                            borderRadius: 50,
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            textDecoration: "none",
                            transition: "transform .2s",
                            boxShadow: "0 4px 20px rgba(224,161,27,0.35)",
                        }}
                    >
                        Shop Now <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* ══════════ SHOP BY CATEGORY ══════════ */}
            <section style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 24px 0" }}>
                <h2 style={{
                    textAlign: "center", fontSize: "1.4rem", fontWeight: 700,
                    color: "var(--color-bg-dark)", marginBottom: 32,
                }}>
                    Shop by Category
                </h2>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                    gap: 14,
                }}>
                    {CATEGORY_CARDS.map((cat) => (
                        <Link
                            key={cat.value}
                            href={`/products?category=${cat.value}`}
                            style={{ textDecoration: "none" }}
                        >
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "20px 8px 16px",
                                    borderRadius: 14,
                                    backgroundColor: "var(--color-bg-light)",
                                    border: "1px solid #e8dcc8",
                                    transition: "all .25s ease",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-4px)";
                                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(90,58,34,0.12)";
                                    e.currentTarget.style.borderColor = "var(--color-primary)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                    e.currentTarget.style.borderColor = "#e8dcc8";
                                }}
                            >
                                <span style={{ fontSize: 32, display: "block", marginBottom: 8 }}>{cat.emoji}</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-bg-dark)" }}>{cat.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ══════════ FEATURED PRODUCTS ══════════ */}
            {featured.length > 0 && (
                <section style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-bg-dark)", display: "flex", alignItems: "center", gap: 8 }}>
                            <Star size={20} style={{ color: "var(--color-primary)" }} /> Featured Collection
                        </h2>
                        <Link href="/products" style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                        {featured.slice(0, 4).map((p) => (
                            <ProductCard key={p.id} product={p} avgRating={avgRating} />
                        ))}
                    </div>
                </section>
            )}

            {/* ══════════ ALL PRODUCTS ══════════ */}
            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px 72px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--color-bg-dark)", display: "flex", alignItems: "center", gap: 8 }}>
                        <Package size={20} /> All Products
                    </h2>
                    <Link href="/products" style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                        View all <ArrowRight size={14} />
                    </Link>
                </div>

                {loading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
                        <Loader2 className="animate-spin" size={32} style={{ color: "var(--color-primary)" }} />
                    </div>
                ) : products.length === 0 ? (
                    <div style={{
                        textAlign: "center", padding: "64px 0",
                        backgroundColor: "rgba(224,161,27,0.06)",
                        borderRadius: 16,
                        border: "1px dashed var(--color-border)",
                    }}>
                        <Package size={48} style={{ color: "var(--color-border)", marginBottom: 12 }} />
                        <p style={{ color: "#8a7560" }}>No products available yet</p>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} avgRating={avgRating} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

/* ── Product Card ── */
function ProductCard({
    product,
    avgRating,
}: {
    product: Product;
    avgRating: (r: { rating: number }[]) => string | null;
}) {
    const rating = avgRating(product.productReviews);
    const discount =
        product.mrp && product.mrp > product.price
            ? Math.round((1 - product.price / product.mrp) * 100)
            : null;

    return (
        <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
            <div
                style={{
                    border: "1px solid #e8dcc8",
                    borderRadius: 12,
                    backgroundColor: "var(--color-bg-light)",
                    overflow: "hidden",
                    transition: "box-shadow .25s, transform .25s",
                    cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(90,58,34,0.15)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                }}
            >
                <div style={{ position: "relative", aspectRatio: "3/4", backgroundColor: "#f0e6d3", overflow: "hidden" }}>
                    {product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s" }} />
                    ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Package size={36} style={{ color: "var(--color-border)" }} />
                        </div>
                    )}
                    {discount && (
                        <span style={{
                            position: "absolute", top: 8, right: 8,
                            fontSize: 10, fontWeight: 600,
                            backgroundColor: "var(--color-secondary)", color: "#fff",
                            padding: "2px 8px", borderRadius: 50,
                        }}>
                            {discount}% OFF
                        </span>
                    )}
                </div>
                <div style={{ padding: 12 }}>
                    {product.seller.shopName && (
                        <p style={{ fontSize: 10, color: "#a09080", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2 }}>
                            {product.seller.shopName}
                        </p>
                    )}
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-bg-dark)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {product.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: "var(--color-secondary)" }}>₹{product.price}</span>
                        {product.mrp && product.mrp > product.price && (
                            <span style={{ fontSize: 12, color: "#b0a090", textDecoration: "line-through" }}>₹{product.mrp}</span>
                        )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 50, backgroundColor: "rgba(224,161,27,0.12)", color: "#9a7520" }}>
                                {formatLabel(product.category)}
                            </span>
                            {product.fabricType && (
                                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 50, backgroundColor: "rgba(90,58,34,0.08)", color: "#7a5a3a" }}>
                                    {formatLabel(product.fabricType)}
                                </span>
                            )}
                        </div>
                        {rating && (
                            <span style={{ fontSize: 10, color: "var(--color-primary)", fontWeight: 600 }}>⭐ {rating}</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
