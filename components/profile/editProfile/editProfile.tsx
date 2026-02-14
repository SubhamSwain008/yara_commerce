"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { User, Phone, Ruler, Weight, Calendar, Loader2, Save } from "lucide-react";

export default function EditProfilePage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        age: "",
        height: "",
        weight: "",
        gender: "",
    });
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const allowed = ["firstName", "lastName", "phone", "age", "height", "weight", "gender"];
            const numeric = ["age", "height", "weight"];
            const payload: any = {};
            for (const key of allowed) {
                const val = (form as any)[key];
                if (val === null || val === undefined) continue;
                const trimmed = typeof val === "string" ? val.trim() : val;
                if (trimmed === "") continue;
                if (numeric.includes(key)) {
                    const n = Number(trimmed);
                    if (!Number.isNaN(n)) payload[key] = n;
                } else {
                    payload[key] = trimmed;
                }
            }

            if (Object.keys(payload).length === 0) {
                setError("Please fill at least one field");
                setLoading(false);
                return;
            }

            const res = await axios.post("/api/user/profile", payload);
            setSuccess(res.data?.message || "Profile updated successfully");
        } catch (err: any) {
            setError(err?.response?.data?.error || err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        axios
            .get("/api/user/profile")
            .then((res) => {
                if (!mounted) return;
                const profile = res.data?.profile?.userProfile ?? res.data?.profile;
                if (!profile) return;
                setForm((f) => ({
                    ...f,
                    firstName: profile.firstName ?? "",
                    lastName: profile.lastName ?? "",
                    phone: profile.phone ?? "",
                    age: profile.age !== undefined && profile.age !== null ? String(profile.age) : "",
                    height: profile.height !== undefined && profile.height !== null ? String(profile.height) : "",
                    weight: profile.weight !== undefined && profile.weight !== null ? String(profile.weight) : "",
                    gender: profile.gender ?? "",
                }));
            })
            .catch(() => { })
            .finally(() => { if (mounted) setPageLoading(false); });

        return () => { mounted = false; };
    }, []);

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        border: "1.5px solid #d4c4a8",
        backgroundColor: "var(--color-bg-light)",
        fontSize: 14,
        color: "var(--color-bg-dark)",
        outline: "none",
        transition: "border-color .2s",
    };

    const labelStyle: React.CSSProperties = {
        display: "flex", alignItems: "center", gap: 4,
        fontSize: 12, fontWeight: 600, color: "#8a7560",
        textTransform: "uppercase", letterSpacing: "0.5px",
        marginBottom: 6,
    };

    if (pageLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
                <Loader2 className="animate-spin" size={28} style={{ color: "var(--color-primary)" }} />
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                maxWidth: 640, margin: "0 auto",
                backgroundColor: "var(--color-bg-light)",
                border: "1px solid #e8dcc8",
                borderRadius: 14,
                padding: 28,
            }}
        >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-bg-dark)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
                <User size={20} style={{ color: "var(--color-primary)" }} /> Edit Profile
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                    <label style={labelStyle}><User size={12} /> First Name</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                        onBlur={(e) => e.target.style.borderColor = "#d4c4a8"}
                    />
                </div>
                <div>
                    <label style={labelStyle}><User size={12} /> Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                        onBlur={(e) => e.target.style.borderColor = "#d4c4a8"}
                    />
                </div>
                <div>
                    <label style={labelStyle}><Phone size={12} /> Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                        onBlur={(e) => e.target.style.borderColor = "#d4c4a8"}
                    />
                </div>
                <div>
                    <label style={labelStyle}><Calendar size={12} /> Age</label>
                    <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Age" style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                        onBlur={(e) => e.target.style.borderColor = "#d4c4a8"}
                    />
                </div>
                <div>
                    <label style={labelStyle}><Ruler size={12} /> Height (cm)</label>
                    <input name="height" type="number" step="any" value={form.height} onChange={handleChange} placeholder="Height" style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                        onBlur={(e) => e.target.style.borderColor = "#d4c4a8"}
                    />
                </div>
                <div>
                    <label style={labelStyle}><Weight size={12} /> Weight (kg)</label>
                    <input name="weight" type="number" step="any" value={form.weight} onChange={handleChange} placeholder="Weight" style={inputStyle}
                        onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                        onBlur={(e) => e.target.style.borderColor = "#d4c4a8"}
                    />
                </div>
            </div>

            <div style={{ marginTop: 16 }}>
                <label style={labelStyle}>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
                    onBlur={(e) => e.target.style.borderColor = "#d4c4a8"}
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "10px 24px",
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-bg-dark)",
                        border: "none", borderRadius: 10,
                        fontWeight: 600, fontSize: 14,
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.6 : 1,
                        transition: "all .2s",
                    }}
                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"; }}
                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "var(--color-primary)"; }}
                >
                    <Save size={16} /> {loading ? "Saving..." : "Save Profile"}
                </button>

                {error && <p style={{ color: "var(--color-secondary)", fontSize: 13, fontWeight: 500 }}>{error}</p>}
                {success && <p style={{ color: "#2d6a2d", fontSize: 13, fontWeight: 500 }}>{success}</p>}
            </div>
        </form>
    );
}