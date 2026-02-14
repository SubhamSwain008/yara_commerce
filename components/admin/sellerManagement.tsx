"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Shield, CheckCircle, Clock, XCircle, Eye, ChevronDown, ChevronUp, MapPin, FileText, Store, Loader2 } from "lucide-react";
import Image from "next/image";

type Tab = "pending" | "approved" | "rejected" | "all";

interface SellerProfile {
    id: string;
    userId: string;
    shopName: string | null;
    gstNumber: string | null;
    isRequestedForSeller: boolean;
    isApprovedByAdmin: boolean;
    user: {
        email: string;
        userProfile: {
            firstName: string | null;
            lastName: string | null;
            phone: string | null;
            age: number | null;
            gender: string | null;
            height: number | null;
            weight: number | null;
        } | null;
    };
    sellerAddress: {
        street: string | null;
        district: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string | null;
    } | null;
    sellerDocs: {
        panCardFront: string | null;
        panCardBack: string | null;
        aadharCardFront: string | null;
        aadharCardBack: string | null;
    } | null;
}

export default function AdminSellersPage() {
    const [sellers, setSellers] = useState<SellerProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<Tab>("pending");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => { fetchSellers(); }, []);

    const fetchSellers = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/admin/sellers");
            setSellers(res.data.sellers || []);
        } catch (err: any) {
            if (err?.response?.status === 403) setError("You do not have admin access.");
            else setError("Failed to fetch sellers");
        } finally { setLoading(false); }
    };

    const handleAction = async (sellerId: string, action: "approve" | "reject") => {
        try {
            setActionLoading(sellerId); setError(null);
            await axios.post("/api/admin/sellers", { sellerId, action });
            setSuccess(`Seller ${action === "approve" ? "approved" : "rejected"} successfully`);
            await fetchSellers();
        } catch (err: any) { setError(err?.response?.data?.error || `Failed to ${action} seller`); } finally { setActionLoading(null); }
    };

    const getStatus = (s: SellerProfile): "pending" | "approved" | "rejected" => {
        if (s.isApprovedByAdmin) return "approved";
        if (s.isRequestedForSeller) return "pending";
        return "rejected";
    };

    const filtered = sellers.filter((s) => { if (tab === "all") return true; return getStatus(s) === tab; });

    const counts = {
        pending: sellers.filter((s) => s.isRequestedForSeller && !s.isApprovedByAdmin).length,
        approved: sellers.filter((s) => s.isApprovedByAdmin).length,
        rejected: sellers.filter((s) => !s.isRequestedForSeller && !s.isApprovedByAdmin).length,
        all: sellers.length,
    };

    const statusBadge = (s: SellerProfile) => {
        const status = getStatus(s);
        const styles: Record<string, React.CSSProperties> = {
            approved: { backgroundColor: "rgba(34,139,34,0.08)", color: "#2d6a2d", border: "1px solid rgba(34,139,34,0.15)" },
            pending: { backgroundColor: "rgba(224,161,27,0.08)", color: "#9a7520", border: "1px solid rgba(224,161,27,0.2)" },
            rejected: { backgroundColor: "rgba(165,18,18,0.06)", color: "var(--color-secondary)", border: "1px solid rgba(165,18,18,0.15)" },
        };
        const icons = { approved: <CheckCircle size={12} />, pending: <Clock size={12} />, rejected: <XCircle size={12} /> };
        const labels = { approved: "Approved", pending: "Pending", rejected: "Rejected" };
        return (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 50, ...styles[status] }}>
                {icons[status]} {labels[status]}
            </span>
        );
    };

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <Loader2 className="animate-spin" size={32} style={{ color: "var(--color-primary)" }} />
        </div>
    );

    if (error && sellers.length === 0) return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
            <div style={{ backgroundColor: "rgba(165,18,18,0.04)", border: "1px solid rgba(165,18,18,0.12)", borderRadius: 14, padding: "40px 32px", textAlign: "center" }}>
                <Shield size={40} style={{ color: "var(--color-secondary)", margin: "0 auto 12px" }} />
                <p style={{ color: "var(--color-secondary)", fontWeight: 600 }}>{error}</p>
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <Shield size={24} style={{ color: "var(--color-primary)" }} />
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--color-bg-dark)" }}>Seller Management</h1>
            </div>

            {error && <div style={{ padding: 12, backgroundColor: "rgba(165,18,18,0.06)", border: "1px solid rgba(165,18,18,0.15)", color: "var(--color-secondary)", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}
            {success && <div style={{ padding: 12, backgroundColor: "rgba(34,139,34,0.06)", border: "1px solid rgba(34,139,34,0.15)", color: "#2d6a2d", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{success}</div>}

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, borderBottom: "2px solid #e8dcc8", marginBottom: 24 }}>
                {(["pending", "approved", "rejected", "all"] as Tab[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => { setTab(t); setSuccess(null); setError(null); }}
                        style={{
                            padding: "10px 20px", fontSize: 13, fontWeight: 600,
                            border: "none", borderBottom: tab === t ? "2px solid var(--color-primary)" : "2px solid transparent",
                            marginBottom: -2, cursor: "pointer", transition: "all .2s",
                            backgroundColor: tab === t ? "rgba(224,161,27,0.06)" : "transparent",
                            color: tab === t ? "var(--color-bg-dark)" : "#8a7560",
                            borderRadius: "8px 8px 0 0",
                        }}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)} <span style={{ fontSize: 11, opacity: 0.7 }}>({counts[t]})</span>
                    </button>
                ))}
            </div>

            {/* Seller List */}
            {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 0", backgroundColor: "rgba(224,161,27,0.04)", borderRadius: 14, border: "1px dashed var(--color-border)", color: "#8a7560" }}>
                    No sellers in this category.
                </div>
            ) : (
                <div style={{ display: "grid", gap: 12 }}>
                    {filtered.map((seller) => {
                        const isExpanded = expandedId === seller.id;
                        return (
                            <div key={seller.id} style={{ border: "1px solid #e8dcc8", borderRadius: 14, backgroundColor: "var(--color-bg-light)", overflow: "hidden" }}>
                                {/* Summary Row */}
                                <div
                                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, cursor: "pointer", transition: "all .2s" }}
                                    onClick={() => setExpandedId(isExpanded ? null : seller.id)}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(224,161,27,0.03)"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "rgba(224,161,27,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Store size={18} style={{ color: "var(--color-primary)" }} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: 14, color: "var(--color-bg-dark)" }}>{seller.shopName || "Unnamed Shop"}</p>
                                            <p style={{ fontSize: 12, color: "#8a7560" }}>{seller.user.email}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        {statusBadge(seller)}
                                        {isExpanded ? <ChevronUp size={18} style={{ color: "#a09080" }} /> : <ChevronDown size={18} style={{ color: "#a09080" }} />}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div style={{ borderTop: "1px solid #ede4d4", padding: 20 }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 20 }}>
                                            <div>
                                                <h4 style={{ fontSize: 12, fontWeight: 700, color: "#8a7560", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Eye size={12} /> Personal
                                                </h4>
                                                {seller.user.userProfile ? (
                                                    <div style={{ fontSize: 13, color: "var(--color-bg-dark)", lineHeight: 1.8 }}>
                                                        <p><strong>Name:</strong> {`${seller.user.userProfile.firstName ?? ""} ${seller.user.userProfile.lastName ?? ""}`.trim() || "—"}</p>
                                                        <p><strong>Phone:</strong> {seller.user.userProfile.phone ?? "—"}</p>
                                                        <p><strong>Age:</strong> {seller.user.userProfile.age ?? "—"}</p>
                                                        <p><strong>Gender:</strong> {seller.user.userProfile.gender ?? "—"}</p>
                                                    </div>
                                                ) : <p style={{ fontSize: 13, color: "#a09080" }}>No profile data</p>}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: 12, fontWeight: 700, color: "#8a7560", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Store size={12} /> Shop
                                                </h4>
                                                <div style={{ fontSize: 13, color: "var(--color-bg-dark)", lineHeight: 1.8 }}>
                                                    <p><strong>Shop:</strong> {seller.shopName ?? "—"}</p>
                                                    <p><strong>GST:</strong> {seller.gstNumber ?? "—"}</p>
                                                    <p><strong>Email:</strong> {seller.user.email}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: 12, fontWeight: 700, color: "#8a7560", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                                                    <MapPin size={12} /> Address
                                                </h4>
                                                {seller.sellerAddress ? (
                                                    <div style={{ fontSize: 13, color: "var(--color-bg-dark)", lineHeight: 1.8 }}>
                                                        <p>{seller.sellerAddress.street ?? "—"}</p>
                                                        <p>{seller.sellerAddress.city ?? "—"}, {seller.sellerAddress.state ?? "—"} {seller.sellerAddress.zipCode ?? ""}</p>
                                                        <p>{seller.sellerAddress.country ?? "—"}</p>
                                                    </div>
                                                ) : <p style={{ fontSize: 13, color: "#a09080" }}>No address provided</p>}
                                            </div>
                                        </div>

                                        {/* Documents */}
                                        <div style={{ marginBottom: 20 }}>
                                            <h4 style={{ fontSize: 12, fontWeight: 700, color: "#8a7560", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
                                                <FileText size={12} /> Documents
                                            </h4>
                                            {seller.sellerDocs ? (
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
                                                    {([["panCardFront", "PAN Front"], ["panCardBack", "PAN Back"], ["aadharCardFront", "Aadhaar Front"], ["aadharCardBack", "Aadhaar Back"]] as const).map(([key, label]) => {
                                                        const url = (seller.sellerDocs as any)?.[key];
                                                        return (
                                                            <div key={key} style={{ textAlign: "center" }}>
                                                                <p style={{ fontSize: 11, color: "#8a7560", marginBottom: 4, fontWeight: 600 }}>{label}</p>
                                                                {url ? (
                                                                    <a href={url} target="_blank" rel="noopener noreferrer">
                                                                        <img src={url} alt={label} style={{ width: "100%", height: 96, objectFit: "cover", borderRadius: 10, border: "1px solid #e8dcc8", transition: "border-color .2s" }} />
                                                                    </a>
                                                                ) : (
                                                                    <div style={{ width: "100%", height: 96, backgroundColor: "rgba(224,161,27,0.04)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#a09080" }}>
                                                                        Not uploaded
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : <p style={{ fontSize: 13, color: "#a09080" }}>No documents uploaded</p>}
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: "flex", gap: 10, paddingTop: 16, borderTop: "1px solid #ede4d4" }}>
                                            {getStatus(seller) === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(seller.id, "approve")}
                                                        disabled={actionLoading === seller.id}
                                                        style={{
                                                            display: "inline-flex", alignItems: "center", gap: 6,
                                                            padding: "8px 18px", backgroundColor: "var(--color-primary)",
                                                            color: "var(--color-bg-dark)", border: "none", borderRadius: 10,
                                                            fontWeight: 600, fontSize: 13, cursor: "pointer",
                                                            opacity: actionLoading === seller.id ? 0.6 : 1,
                                                        }}
                                                    >
                                                        <CheckCircle size={14} /> {actionLoading === seller.id ? "Processing..." : "Approve"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(seller.id, "reject")}
                                                        disabled={actionLoading === seller.id}
                                                        style={{
                                                            display: "inline-flex", alignItems: "center", gap: 6,
                                                            padding: "8px 18px", backgroundColor: "rgba(165,18,18,0.08)",
                                                            color: "var(--color-secondary)", border: "1px solid rgba(165,18,18,0.15)", borderRadius: 10,
                                                            fontWeight: 600, fontSize: 13, cursor: "pointer",
                                                            opacity: actionLoading === seller.id ? 0.6 : 1,
                                                        }}
                                                    >
                                                        <XCircle size={14} /> Reject
                                                    </button>
                                                </>
                                            )}
                                            {getStatus(seller) === "approved" && (
                                                <button
                                                    onClick={() => handleAction(seller.id, "reject")}
                                                    disabled={actionLoading === seller.id}
                                                    style={{
                                                        display: "inline-flex", alignItems: "center", gap: 6,
                                                        padding: "8px 18px", backgroundColor: "rgba(165,18,18,0.06)",
                                                        color: "var(--color-secondary)", border: "1px solid rgba(165,18,18,0.12)", borderRadius: 10,
                                                        fontWeight: 600, fontSize: 13, cursor: "pointer",
                                                        opacity: actionLoading === seller.id ? 0.6 : 1,
                                                    }}
                                                >
                                                    <XCircle size={14} /> Revoke Approval
                                                </button>
                                            )}
                                            {getStatus(seller) === "rejected" && (
                                                <button
                                                    onClick={() => handleAction(seller.id, "approve")}
                                                    disabled={actionLoading === seller.id}
                                                    style={{
                                                        display: "inline-flex", alignItems: "center", gap: 6,
                                                        padding: "8px 18px", backgroundColor: "var(--color-primary)",
                                                        color: "var(--color-bg-dark)", border: "none", borderRadius: 10,
                                                        fontWeight: 600, fontSize: 13, cursor: "pointer",
                                                        opacity: actionLoading === seller.id ? 0.6 : 1,
                                                    }}
                                                >
                                                    <CheckCircle size={14} /> Re-approve
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
