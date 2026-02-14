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

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/admin/sellers");
            setSellers(res.data.sellers || []);
        } catch (err: any) {
            if (err?.response?.status === 403) {
                setError("You do not have admin access.");
            } else {
                setError("Failed to fetch sellers");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (sellerId: string, action: "approve" | "reject") => {
        try {
            setActionLoading(sellerId);
            setError(null);
            await axios.post("/api/admin/sellers", { sellerId, action });
            setSuccess(`Seller ${action === "approve" ? "approved" : "rejected"} successfully`);
            // Refresh
            await fetchSellers();
        } catch (err: any) {
            setError(err?.response?.data?.error || `Failed to ${action} seller`);
        } finally {
            setActionLoading(null);
        }
    };

    const getStatus = (s: SellerProfile): "pending" | "approved" | "rejected" => {
        if (s.isApprovedByAdmin) return "approved";
        if (s.isRequestedForSeller) return "pending";
        return "rejected";
    };

    const filtered = sellers.filter((s) => {
        if (tab === "all") return true;
        return getStatus(s) === tab;
    });

    const counts = {
        pending: sellers.filter((s) => s.isRequestedForSeller && !s.isApprovedByAdmin).length,
        approved: sellers.filter((s) => s.isApprovedByAdmin).length,
        rejected: sellers.filter((s) => !s.isRequestedForSeller && !s.isApprovedByAdmin).length,
        all: sellers.length,
    };

    const statusBadge = (s: SellerProfile) => {
        const status = getStatus(s);
        if (status === "approved")
            return (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                    <CheckCircle size={12} /> Approved
                </span>
            );
        if (status === "pending")
            return (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                    <Clock size={12} /> Pending
                </span>
            );
        return (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
                <XCircle size={12} /> Rejected
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    if (error && sellers.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <Shield className="mx-auto text-red-400 mb-3" size={40} />
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Shield size={28} className="text-gray-700" />
                <h1 className="text-2xl font-bold">Seller Management</h1>
            </div>

            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>
            )}
            {success && (
                <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-1">
                {(["pending", "approved", "rejected", "all"] as Tab[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => { setTab(t); setSuccess(null); setError(null); }}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === t
                            ? "bg-white border border-b-0 border-gray-200 text-black -mb-px"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}{" "}
                        <span className="text-xs text-gray-400">({counts[t]})</span>
                    </button>
                ))}
            </div>

            {/* Seller List */}
            {filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                    No sellers in this category.
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((seller) => {
                        const isExpanded = expandedId === seller.id;
                        return (
                            <div
                                key={seller.id}
                                className="border border-gray-200 rounded-xl bg-white overflow-hidden"
                            >
                                {/* Summary Row */}
                                <div
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => setExpandedId(isExpanded ? null : seller.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <Store size={18} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {seller.shopName || "Unnamed Shop"}
                                            </p>
                                            <p className="text-sm text-gray-500">{seller.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {statusBadge(seller)}
                                        {isExpanded ? (
                                            <ChevronUp size={18} className="text-gray-400" />
                                        ) : (
                                            <ChevronDown size={18} className="text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 p-5 space-y-5 bg-gray-50/50">
                                        {/* Profile Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                                    <Eye size={14} /> Personal Details
                                                </h4>
                                                {seller.user.userProfile ? (
                                                    <div className="space-y-1 text-sm">
                                                        <p><strong>Name:</strong> {`${seller.user.userProfile.firstName ?? ""} ${seller.user.userProfile.lastName ?? ""}`.trim() || "—"}</p>
                                                        <p><strong>Phone:</strong> {seller.user.userProfile.phone ?? "—"}</p>
                                                        <p><strong>Age:</strong> {seller.user.userProfile.age ?? "—"}</p>
                                                        <p><strong>Gender:</strong> {seller.user.userProfile.gender ?? "—"}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-400">No profile data</p>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                                    <Store size={14} /> Shop Details
                                                </h4>
                                                <div className="space-y-1 text-sm">
                                                    <p><strong>Shop:</strong> {seller.shopName ?? "—"}</p>
                                                    <p><strong>GST:</strong> {seller.gstNumber ?? "—"}</p>
                                                    <p><strong>Email:</strong> {seller.user.email}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                                    <MapPin size={14} /> Address
                                                </h4>
                                                {seller.sellerAddress ? (
                                                    <div className="space-y-1 text-sm">
                                                        <p>{seller.sellerAddress.street ?? "—"}</p>
                                                        <p>
                                                            {seller.sellerAddress.city ?? "—"},{" "}
                                                            {seller.sellerAddress.state ?? "—"}{" "}
                                                            {seller.sellerAddress.zipCode ?? ""}
                                                        </p>
                                                        <p>{seller.sellerAddress.country ?? "—"}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-400">No address provided</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Documents */}
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                                                <FileText size={14} /> Documents
                                            </h4>
                                            {seller.sellerDocs ? (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {(
                                                        [
                                                            ["panCardFront", "PAN Front"],
                                                            ["panCardBack", "PAN Back"],
                                                            ["aadharCardFront", "Aadhaar Front"],
                                                            ["aadharCardBack", "Aadhaar Back"],
                                                        ] as const
                                                    ).map(([key, label]) => {
                                                        const url = (seller.sellerDocs as any)?.[key];
                                                        return (
                                                            <div key={key} className="text-center">
                                                                <p className="text-xs text-gray-500 mb-1">{label}</p>
                                                                {url ? (
                                                                    <a href={url} target="_blank" rel="noopener noreferrer">
                                                                        <img
                                                                            src={url}
                                                                            alt={label}
                                                                            className="w-full h-24 object-cover rounded-lg border border-gray-200 hover:border-blue-400 transition-colors"
                                                                        />
                                                                    </a>
                                                                ) : (
                                                                    <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                                                                        Not uploaded
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400">No documents uploaded</p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-2 border-t border-gray-200">
                                            {getStatus(seller) === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(seller.id, "approve")}
                                                        disabled={actionLoading === seller.id}
                                                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        <CheckCircle size={14} />
                                                        {actionLoading === seller.id ? "Processing..." : "Approve"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(seller.id, "reject")}
                                                        disabled={actionLoading === seller.id}
                                                        className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        <XCircle size={14} />
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {getStatus(seller) === "approved" && (
                                                <button
                                                    onClick={() => handleAction(seller.id, "reject")}
                                                    disabled={actionLoading === seller.id}
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
                                                >
                                                    <XCircle size={14} />
                                                    Revoke Approval
                                                </button>
                                            )}
                                            {getStatus(seller) === "rejected" && (
                                                <button
                                                    onClick={() => handleAction(seller.id, "approve")}
                                                    disabled={actionLoading === seller.id}
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 disabled:opacity-50 transition-colors"
                                                >
                                                    <CheckCircle size={14} />
                                                    Re-approve
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
