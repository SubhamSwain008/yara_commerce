"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2, Package, SlidersHorizontal, Search, X } from "lucide-react";
import Link from "next/link";

const formatLabel = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const CATEGORIES = [
    { value: "saree", label: "Saree" },
    { value: "lehenga", label: "Lehenga" },
    { value: "dupatta", label: "Dupatta" },
    { value: "dress_material", label: "Dress Material" },
    { value: "blouse_piece", label: "Blouse Piece" },
    { value: "raw_fabric", label: "Raw Fabric" },
    { value: "kurta", label: "Kurta" },
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
    { value: "stole", label: "Stole" },
];

const FABRIC_TYPES = [
    "silk", "cotton", "linen", "chiffon", "georgette", "crepe", "satin",
    "velvet", "net", "organza", "banarasi", "tussar", "chanderi", "jute",
    "polyester", "rayon", "khadi", "muslin",
];

const WEAVE_TYPES = [
    "handloom", "powerloom", "machine_made", "hand_embroidered",
    "block_print", "screen_print", "digital_print",
];

const COLORS = [
    "red", "blue", "green", "yellow", "orange", "pink", "purple", "white",
    "black", "maroon", "gold", "silver", "beige", "cream", "brown",
    "multi_color", "off_white", "magenta", "turquoise", "peach", "coral",
    "teal", "navy", "olive", "lavender", "rust", "wine", "emerald", "sky_blue", "pastel",
];

const PATTERNS = [
    "plain", "printed", "woven", "embroidered", "zari", "sequin", "bandhani",
    "ikat", "patola", "kalamkari", "block_print", "floral", "geometric",
    "abstract", "traditional", "paisley", "checked", "striped",
];

const OCCASIONS = [
    "wedding", "festive", "casual", "party", "office", "daily_wear", "bridal", "puja",
];

const SORT_OPTIONS = [
    { value: "newest", label: "Newest First" },
    { value: "price_asc", label: "Price: Low → High" },
    { value: "price_desc", label: "Price: High → Low" },
];

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    mrp: number | null;
    category: string;
    fabricType: string | null;
    weaveType: string | null;
    origin: string | null;
    color: string | null;
    pattern: string | null;
    images: string[];
    seller: { shopName: string | null };
    productReviews: { rating: number }[];
}

/* ─── Styles ─── */
const selectStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #d4c4a8",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 13,
    backgroundColor: "var(--color-bg-light)",
    color: "var(--color-bg-dark)",
    outline: "none",
};

export default function ProductsPageWrapper() {
    return (
        <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}><Loader2 className="animate-spin" size={32} style={{ color: "var(--color-primary)" }} /></div>}>
            <ProductsPage />
        </Suspense>
    );
}

function ProductsPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [fabricType, setFabricType] = useState(searchParams.get("fabricType") || "");
    const [weaveType, setWeaveType] = useState(searchParams.get("weaveType") || "");
    const [color, setColor] = useState(searchParams.get("color") || "");
    const [pattern, setPattern] = useState(searchParams.get("pattern") || "");
    const [occasion, setOccasion] = useState(searchParams.get("occasion") || "");
    const [sort, setSort] = useState(searchParams.get("sort") || "newest");

    const activeFilterCount = [category, fabricType, weaveType, color, pattern, occasion].filter(Boolean).length;

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (category) params.set("category", category);
            if (fabricType) params.set("fabricType", fabricType);
            if (weaveType) params.set("weaveType", weaveType);
            if (color) params.set("color", color);
            if (pattern) params.set("pattern", pattern);
            if (occasion) params.set("occasion", occasion);
            if (sort) params.set("sort", sort);
            const res = await axios.get(`/api/products?${params.toString()}`);
            setProducts(res.data.products || []);
        } catch {
        } finally {
            setLoading(false);
        }
    }, [search, category, fabricType, weaveType, color, pattern, occasion, sort]);

    useEffect(() => {
        const timer = setTimeout(() => fetchProducts(), 300);
        return () => clearTimeout(timer);
    }, [fetchProducts]);

    const clearFilters = () => {
        setCategory(""); setFabricType(""); setWeaveType("");
        setColor(""); setPattern(""); setOccasion(""); setSearch("");
    };

    const avgRating = (reviews: { rating: number }[]) => {
        if (!reviews.length) return null;
        return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
    };

    return (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px 64px" }}>
            {/* Header */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-bg-dark)", display: "flex", alignItems: "center", gap: 8 }}>
                    <Package size={24} style={{ color: "var(--color-primary)" }} /> Products
                    {!loading && <span style={{ fontSize: 13, fontWeight: 400, color: "#a09080" }}>({products.length})</span>}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    {/* Search */}
                    <div style={{ position: "relative" }}>
                        <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#b0a090" }} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            style={{
                                width: 220,
                                paddingLeft: 32, paddingRight: 10,
                                padding: "8px 12px 8px 32px",
                                border: "1px solid #d4c4a8",
                                borderRadius: 8,
                                fontSize: 13,
                                backgroundColor: "var(--color-bg-light)",
                                color: "var(--color-bg-dark)",
                                outline: "none",
                            }}
                        />
                    </div>
                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        style={{ ...selectStyle, width: "auto" }}
                    >
                        {SORT_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                    {/* Filter toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "8px 14px",
                            border: showFilters || activeFilterCount > 0 ? "1px solid var(--color-primary)" : "1px solid #d4c4a8",
                            borderRadius: 8,
                            fontSize: 13,
                            cursor: "pointer",
                            backgroundColor: showFilters || activeFilterCount > 0 ? "var(--color-primary)" : "var(--color-bg-light)",
                            color: showFilters || activeFilterCount > 0 ? "var(--color-bg-dark)" : "#7a5a3a",
                            fontWeight: 600,
                            transition: "all .2s",
                        }}
                    >
                        <SlidersHorizontal size={14} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span style={{
                                width: 18, height: 18, borderRadius: "50%",
                                backgroundColor: showFilters ? "var(--color-bg-dark)" : "var(--color-primary)",
                                color: showFilters ? "var(--color-primary)" : "var(--color-bg-dark)",
                                fontSize: 10, fontWeight: 700,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Filter panel */}
            {showFilters && (
                <div style={{
                    border: "1px solid #d4c4a8",
                    borderRadius: 12,
                    backgroundColor: "var(--color-bg-light)",
                    padding: 20,
                    marginBottom: 24,
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--color-bg-dark)" }}>Filter By</h3>
                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} style={{ fontSize: 12, color: "var(--color-secondary)", cursor: "pointer", background: "none", border: "none", display: "flex", alignItems: "center", gap: 3 }}>
                                <X size={12} /> Clear all
                            </button>
                        )}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
                        <FilterSelect label="Category" value={category} onChange={setCategory} options={CATEGORIES.map(c => ({ value: c.value, label: c.label }))} />
                        <FilterSelect label="Fabric" value={fabricType} onChange={setFabricType} options={FABRIC_TYPES.map(f => ({ value: f, label: formatLabel(f) }))} />
                        <FilterSelect label="Weave" value={weaveType} onChange={setWeaveType} options={WEAVE_TYPES.map(w => ({ value: w, label: formatLabel(w) }))} />
                        <FilterSelect label="Color" value={color} onChange={setColor} options={COLORS.map(c => ({ value: c, label: formatLabel(c) }))} />
                        <FilterSelect label="Pattern" value={pattern} onChange={setPattern} options={PATTERNS.map(p => ({ value: p, label: formatLabel(p) }))} />
                        <FilterSelect label="Occasion" value={occasion} onChange={setOccasion} options={OCCASIONS.map(o => ({ value: o, label: formatLabel(o) }))} />
                    </div>
                </div>
            )}

            {/* Active filter tags */}
            {activeFilterCount > 0 && !showFilters && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                    {category && <FilterTag label={`Category: ${formatLabel(category)}`} onClear={() => setCategory("")} />}
                    {fabricType && <FilterTag label={`Fabric: ${formatLabel(fabricType)}`} onClear={() => setFabricType("")} />}
                    {weaveType && <FilterTag label={`Weave: ${formatLabel(weaveType)}`} onClear={() => setWeaveType("")} />}
                    {color && <FilterTag label={`Color: ${formatLabel(color)}`} onClear={() => setColor("")} />}
                    {pattern && <FilterTag label={`Pattern: ${formatLabel(pattern)}`} onClear={() => setPattern("")} />}
                    {occasion && <FilterTag label={`Occasion: ${formatLabel(occasion)}`} onClear={() => setOccasion("")} />}
                    <button onClick={clearFilters} style={{ fontSize: 12, color: "var(--color-secondary)", cursor: "pointer", background: "none", border: "none", textDecoration: "underline" }}>
                        Clear all
                    </button>
                </div>
            )}

            {/* Products Grid */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                    <Loader2 className="animate-spin" size={32} style={{ color: "var(--color-primary)" }} />
                </div>
            ) : products.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: 64,
                    backgroundColor: "rgba(224,161,27,0.06)",
                    borderRadius: 16,
                    border: "1px dashed var(--color-border)",
                }}>
                    <Package size={48} style={{ color: "var(--color-border)", marginBottom: 12 }} />
                    <p style={{ color: "#8a7560", marginBottom: 8 }}>No products found</p>
                    {activeFilterCount > 0 && (
                        <button onClick={clearFilters} style={{ fontSize: 13, color: "var(--color-primary)", cursor: "pointer", background: "none", border: "none", textDecoration: "underline" }}>
                            Clear all filters
                        </button>
                    )}
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                    {products.map((product) => {
                        const rating = avgRating(product.productReviews);
                        const discount = product.mrp && product.mrp > product.price
                            ? Math.round((1 - product.price / product.mrp) * 100)
                            : null;

                        return (
                            <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
                                <div
                                    style={{
                                        border: "1px solid #e8dcc8",
                                        borderRadius: 12,
                                        backgroundColor: "var(--color-bg-light)",
                                        overflow: "hidden",
                                        transition: "box-shadow .25s, transform .25s",
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
                                            <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                    })}
                </div>
            )}
        </div>
    );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
    return (
        <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#8a7560", marginBottom: 4 }}>{label}</label>
            <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
                <option value="">All</option>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    );
}

function FilterTag({ label, onClear }: { label: string; onClear: () => void }) {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 12,
            backgroundColor: "rgba(224,161,27,0.12)",
            color: "#7a5a3a",
            padding: "4px 10px",
            borderRadius: 50,
            border: "1px solid #d4c4a8",
        }}>
            {label}
            <button onClick={onClear} style={{ color: "var(--color-secondary)", cursor: "pointer", background: "none", border: "none", padding: 0, display: "flex" }}>
                <X size={12} />
            </button>
        </span>
    );
}
