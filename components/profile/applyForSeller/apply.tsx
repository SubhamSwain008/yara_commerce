"use client";

import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Upload, CheckCircle, ArrowRight, ArrowLeft, Store, MapPin, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3;

interface DocFile {
    file: File | null;
    preview: string | null;
    uploadedUrl: string | null;
}

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1.5px solid #d4c4a8", backgroundColor: "var(--color-bg-light)",
    fontSize: 14, color: "var(--color-bg-dark)", outline: "none", transition: "border-color .2s",
};
const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 600, color: "#8a7560",
    textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6,
};

export default function ApplyForSeller() {
    const router = useRouter();
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [alreadyApplied, setAlreadyApplied] = useState(false);
    const [isApproved, setIsApproved] = useState(false);

    const [shopName, setShopName] = useState("");
    const [gstNumber, setGstNumber] = useState("");
    const [address, setAddress] = useState({ street: "", district: "", city: "", state: "", zipCode: "", country: "" });
    const [docs, setDocs] = useState<{
        panCardFront: DocFile; panCardBack: DocFile; aadharCardFront: DocFile; aadharCardBack: DocFile;
    }>({
        panCardFront: { file: null, preview: null, uploadedUrl: null },
        panCardBack: { file: null, preview: null, uploadedUrl: null },
        aadharCardFront: { file: null, preview: null, uploadedUrl: null },
        aadharCardBack: { file: null, preview: null, uploadedUrl: null },
    });

    useEffect(() => {
        let mounted = true;
        axios.get("/api/seller/apply")
            .then((res) => {
                if (!mounted) return;
                const sp = res.data?.sellerProfile;
                if (sp) {
                    setShopName(sp.shopName ?? "");
                    setGstNumber(sp.gstNumber ?? "");
                    if (sp.isRequestedForSeller) setAlreadyApplied(true);
                    if (sp.isApprovedByAdmin) setIsApproved(true);
                    if (sp.sellerAddress) {
                        setAddress({
                            street: sp.sellerAddress.street ?? "", district: sp.sellerAddress.district ?? "",
                            city: sp.sellerAddress.city ?? "", state: sp.sellerAddress.state ?? "",
                            zipCode: sp.sellerAddress.zipCode ?? "", country: sp.sellerAddress.country ?? "",
                        });
                    }
                    if (sp.sellerDocs) {
                        setDocs({
                            panCardFront: { file: null, preview: sp.sellerDocs.panCardFront, uploadedUrl: sp.sellerDocs.panCardFront },
                            panCardBack: { file: null, preview: sp.sellerDocs.panCardBack, uploadedUrl: sp.sellerDocs.panCardBack },
                            aadharCardFront: { file: null, preview: sp.sellerDocs.aadharCardFront, uploadedUrl: sp.sellerDocs.aadharCardFront },
                            aadharCardBack: { file: null, preview: sp.sellerDocs.aadharCardBack, uploadedUrl: sp.sellerDocs.aadharCardBack },
                        });
                    }
                }
            })
            .catch(() => { })
            .finally(() => { if (mounted) setFetchLoading(false); });
        return () => { mounted = false; };
    }, []);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress((p) => ({ ...p, [name]: value }));
    };

    const handleFileChange = (docType: keyof typeof docs) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setDocs((p) => ({ ...p, [docType]: { file, preview, uploadedUrl: null } }));
    };

    const uploadSingleDoc = async (docType: string, file: File): Promise<string> => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("docType", docType);
        const res: AxiosResponse = await axios.post("/api/seller/upload-doc", fd);
        return res.data.url;
    };

    const validateStep1 = (): boolean => { if (!shopName.trim()) { setError("Shop name is required"); return false; } if (!gstNumber.trim()) { setError("GST number is required"); return false; } setError(null); return true; };
    const validateStep2 = (): boolean => { if (!address.street.trim()) { setError("Street is required"); return false; } if (!address.city.trim()) { setError("City is required"); return false; } if (!address.state.trim()) { setError("State is required"); return false; } if (!address.zipCode.trim()) { setError("ZIP Code is required"); return false; } if (!address.country.trim()) { setError("Country is required"); return false; } setError(null); return true; };
    const validateStep3 = (): boolean => { for (const key of Object.keys(docs) as (keyof typeof docs)[]) { const d = docs[key]; if (!d.file && !d.uploadedUrl) { setError(`Please upload ${formatDocLabel(key)}`); return false; } } setError(null); return true; };

    const formatDocLabel = (key: string): string => {
        const map: Record<string, string> = { panCardFront: "PAN Card (Front)", panCardBack: "PAN Card (Back)", aadharCardFront: "Aadhaar Card (Front)", aadharCardBack: "Aadhaar Card (Back)" };
        return map[key] ?? key;
    };

    const nextStep = () => { if (step === 1 && validateStep1()) setStep(2); else if (step === 2 && validateStep2()) setStep(3); };
    const prevStep = () => { setError(null); if (step === 2) setStep(1); else if (step === 3) setStep(2); };

    const handleSubmit = async () => {
        if (!validateStep3()) return;
        setLoading(true); setError(null); setSuccess(null);
        try {
            const docUrls: Record<string, string> = {};
            for (const key of Object.keys(docs) as (keyof typeof docs)[]) {
                const d = docs[key];
                if (d.file) docUrls[key] = await uploadSingleDoc(key, d.file);
                else if (d.uploadedUrl) docUrls[key] = d.uploadedUrl;
            }
            await axios.post("/api/seller/apply", { shopName, gstNumber, address, docs: docUrls });
            setSuccess("Your seller application has been submitted successfully!");
            setAlreadyApplied(true);
            router.push("/profile");
        } catch (err: any) { setError(err?.response?.data?.error || err.message || "Submission failed"); } finally { setLoading(false); }
    };

    if (fetchLoading) return (
        <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
            <Loader2 className="animate-spin" size={28} style={{ color: "var(--color-primary)" }} />
        </div>
    );

    if (isApproved) return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
            <div style={{ backgroundColor: "rgba(34,139,34,0.05)", border: "1px solid rgba(34,139,34,0.15)", borderRadius: 14, padding: "40px 32px", textAlign: "center" }}>
                <CheckCircle size={48} style={{ color: "#2d6a2d", margin: "0 auto 16px" }} />
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#2d6a2d" }}>You&apos;re an Approved Seller!</h2>
                <p style={{ color: "#4a8a4a", marginTop: 8 }}>Your seller account has been approved. You can start listing products.</p>
            </div>
        </div>
    );

    if (alreadyApplied && !success) return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
            <div style={{ backgroundColor: "rgba(224,161,27,0.06)", border: "1px solid rgba(224,161,27,0.2)", borderRadius: 14, padding: "40px 32px", textAlign: "center" }}>
                <Store size={48} style={{ color: "var(--color-primary)", margin: "0 auto 16px" }} />
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--color-bg-dark)" }}>Application Pending</h2>
                <p style={{ color: "#8a7560", marginTop: 8 }}>Your seller application is under review. We&apos;ll notify you once it&apos;s approved.</p>
            </div>
        </div>
    );

    const stepIndicators = [
        { num: 1, label: "Shop Details", icon: Store },
        { num: 2, label: "Address", icon: MapPin },
        { num: 3, label: "Documents", icon: FileText },
    ];

    const btnNext: React.CSSProperties = {
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "10px 22px", backgroundColor: "var(--color-primary)",
        color: "var(--color-bg-dark)", border: "none", borderRadius: 10,
        fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all .2s",
    };
    const btnBack: React.CSSProperties = {
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "10px 22px", backgroundColor: "transparent",
        color: "#8a7560", border: "1.5px solid #d4c4a8", borderRadius: 10,
        fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all .2s",
    };

    return (
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
            {/* Step Indicators */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
                {stepIndicators.map((s, i) => {
                    const Icon = s.icon;
                    const isActive = step === s.num;
                    const isDone = step > s.num;
                    return (
                        <div key={s.num} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 14, fontWeight: 600, transition: "all .2s",
                                    backgroundColor: isDone ? "#2d6a2d" : isActive ? "var(--color-primary)" : "rgba(224,161,27,0.1)",
                                    color: isDone ? "#fff" : isActive ? "var(--color-bg-dark)" : "#8a7560",
                                }}>
                                    {isDone ? <CheckCircle size={18} /> : <Icon size={18} />}
                                </div>
                                <span style={{ fontSize: 11, marginTop: 4, fontWeight: isActive ? 700 : 500, color: isActive ? "var(--color-bg-dark)" : "#8a7560" }}>
                                    {s.label}
                                </span>
                            </div>
                            {i < stepIndicators.length - 1 && (
                                <div style={{ height: 2, flex: 1, marginTop: -14, backgroundColor: step > s.num ? "#2d6a2d" : "#e8dcc8", borderRadius: 2 }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {error && <div style={{ padding: 12, backgroundColor: "rgba(165,18,18,0.06)", border: "1px solid rgba(165,18,18,0.15)", color: "var(--color-secondary)", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}
            {success && <div style={{ padding: 12, backgroundColor: "rgba(34,139,34,0.06)", border: "1px solid rgba(34,139,34,0.15)", color: "#2d6a2d", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{success}</div>}

            {/* Step 1: Shop Details */}
            {step === 1 && (
                <div style={{ backgroundColor: "var(--color-bg-light)", border: "1px solid #e8dcc8", borderRadius: 14, padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-bg-dark)", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                        <Store size={18} style={{ color: "var(--color-primary)" }} /> Shop Details
                    </h3>
                    <div style={{ display: "grid", gap: 16 }}>
                        <div><label style={labelStyle}>Shop / Business Name *</label><input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="e.g. Srinibas Vastra" style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
                        <div><label style={labelStyle}>GST Number *</label><input type="text" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="e.g. 22AAAAA0000A1Z5" style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                        <button onClick={nextStep} style={btnNext}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--color-primary)"}
                        >Next <ArrowRight size={16} /></button>
                    </div>
                </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
                <div style={{ backgroundColor: "var(--color-bg-light)", border: "1px solid #e8dcc8", borderRadius: 14, padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-bg-dark)", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                        <MapPin size={18} style={{ color: "var(--color-primary)" }} /> Shop / Godown Address
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div><label style={labelStyle}>Street *</label><input name="street" value={address.street} onChange={handleAddressChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
                        <div><label style={labelStyle}>District</label><input name="district" value={address.district} onChange={handleAddressChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
                        <div><label style={labelStyle}>City *</label><input name="city" value={address.city} onChange={handleAddressChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
                        <div><label style={labelStyle}>State *</label><input name="state" value={address.state} onChange={handleAddressChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
                        <div><label style={labelStyle}>ZIP Code *</label><input name="zipCode" value={address.zipCode} onChange={handleAddressChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
                        <div><label style={labelStyle}>Country *</label><input name="country" value={address.country} onChange={handleAddressChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                        <button onClick={prevStep} style={btnBack}><ArrowLeft size={16} /> Back</button>
                        <button onClick={nextStep} style={btnNext}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--color-primary)"}
                        >Next <ArrowRight size={16} /></button>
                    </div>
                </div>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
                <div style={{ backgroundColor: "var(--color-bg-light)", border: "1px solid #e8dcc8", borderRadius: 14, padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-bg-dark)", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <FileText size={18} style={{ color: "var(--color-primary)" }} /> Upload Documents
                    </h3>
                    <p style={{ fontSize: 13, color: "#8a7560", marginBottom: 20 }}>Upload clear images of your PAN Card and Aadhaar Card (front and back)</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        {(Object.keys(docs) as (keyof typeof docs)[]).map((docType) => {
                            const d = docs[docType];
                            return (
                                <div key={docType}>
                                    <label style={labelStyle}>{formatDocLabel(docType)} *</label>
                                    <label style={{
                                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                        border: d.preview ? "2px solid var(--color-primary)" : "2px dashed #d4c4a8",
                                        borderRadius: 12, padding: 16, cursor: "pointer", transition: "all .2s",
                                        minHeight: 140,
                                        backgroundColor: d.preview ? "rgba(224,161,27,0.04)" : "rgba(224,161,27,0.02)",
                                    }}>
                                        {d.preview ? (
                                            <img src={d.preview} alt={formatDocLabel(docType)} style={{ maxHeight: 112, objectFit: "contain", borderRadius: 8 }} />
                                        ) : (
                                            <>
                                                <Upload size={24} style={{ color: "var(--color-primary)", marginBottom: 8 }} />
                                                <span style={{ fontSize: 12, color: "#8a7560" }}>Click to upload</span>
                                            </>
                                        )}
                                        <input type="file" accept="image/*" className="hidden" style={{ display: "none" }} onChange={handleFileChange(docType)} />
                                    </label>
                                    {d.preview && (
                                        <p style={{ marginTop: 6, fontSize: 11, color: "#2d6a2d", display: "flex", alignItems: "center", gap: 4 }}>
                                            <CheckCircle size={12} /> {d.file ? "Ready to upload" : "Previously uploaded"}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                        <button onClick={prevStep} style={btnBack}><ArrowLeft size={16} /> Back</button>
                        <button onClick={handleSubmit} disabled={loading}
                            style={{ ...btnNext, opacity: loading ? 0.6 : 1 }}
                            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"; }}
                            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "var(--color-primary)"; }}
                        >
                            {loading ? <><Loader2 className="animate-spin" size={16} /> Submitting...</> : "Submit Application"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}