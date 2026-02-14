"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
	User, Mail, Phone, MapPin, Edit2, Store, CheckCircle, Clock,
	Loader2, Ruler, Weight, Calendar,
} from "lucide-react";

export default function ProfilePage() {
	const [profile, setProfile] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		let mounted = true;
		setLoading(true);

		axios
			.get("/api/user/profile")
			.then((res) => {
				if (!mounted) return;
				const data = res.data;
				setProfile(data.profile ?? data);
				setError(null);
			})
			.catch((err) => {
				if (!mounted) return;
				const msg = err?.response?.data?.error || err.message || "Error fetching profile";
				setError(msg);
			})
			.finally(() => {
				if (!mounted) return;
				setLoading(false);
			});

		return () => { mounted = false; };
	}, []);

	const btnGold: React.CSSProperties = {
		display: "inline-flex", alignItems: "center", gap: 6,
		padding: "10px 20px",
		backgroundColor: "var(--color-primary)",
		color: "var(--color-bg-dark)",
		border: "none", borderRadius: 8,
		fontWeight: 600, fontSize: 13,
		cursor: "pointer",
		transition: "all .2s",
	};

	const cardStyle: React.CSSProperties = {
		backgroundColor: "var(--color-bg-light)",
		border: "1px solid #e8dcc8",
		borderRadius: 12,
		padding: 24,
	};

	const labelStyle: React.CSSProperties = {
		fontSize: 11, fontWeight: 600, color: "#a09080",
		textTransform: "uppercase", letterSpacing: "0.5px",
		marginBottom: 2,
	};

	const valueStyle: React.CSSProperties = {
		fontSize: 15, color: "var(--color-bg-dark)", fontWeight: 500,
	};

	if (loading) {
		return (
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
				<Loader2 className="animate-spin" size={32} style={{ color: "var(--color-primary)" }} />
			</div>
		);
	}

	if (error) {
		return (
			<div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
				<p style={{ color: "var(--color-secondary)", fontWeight: 500 }}>Error: {error}</p>
			</div>
		);
	}

	if (!profile) {
		return (
			<div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
				<p style={{ color: "#8a7560" }}>No profile data available.</p>
			</div>
		);
	}

	const up = profile.userProfile;
	const fullName = up ? `${up.firstName ?? ""} ${up.lastName ?? ""}`.trim() : null;
	const defaultAddr = Array.isArray(profile.userAddress)
		? profile.userAddress.find((a: any) => a.isDefault)
		: null;

	return (
		<div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 64px" }}>
			{/* Page header */}
			<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
				<h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-bg-dark)", display: "flex", alignItems: "center", gap: 8 }}>
					<User size={24} style={{ color: "var(--color-primary)" }} /> My Profile
				</h1>
			</div>

			{/* Profile card */}
			<div style={{ ...cardStyle, marginBottom: 16 }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
					<h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-bg-dark)" }}>Personal Details</h2>
					<button
						style={btnGold}
						onClick={() => router.push("/profile/editProfile")}
						onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"; }}
						onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--color-primary)"; }}
					>
						<Edit2 size={14} /> Edit Profile
					</button>
				</div>

				{up ? (
					<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
						<InfoItem icon={<User size={14} />} label="Name" value={fullName || "—"} />
						<InfoItem icon={<Mail size={14} />} label="Email" value={profile.email ?? "—"} />
						<InfoItem icon={<Phone size={14} />} label="Phone" value={up.phone ?? "—"} />
						<InfoItem icon={<Calendar size={14} />} label="Age" value={up.age ? `${up.age} yrs` : "—"} />
						<InfoItem icon={<User size={14} />} label="Gender" value={up.gender ?? "—"} />
						<InfoItem icon={<Ruler size={14} />} label="Height" value={up.height ? `${up.height} cm` : "—"} />
						<InfoItem icon={<Weight size={14} />} label="Weight" value={up.weight ? `${up.weight} kg` : "—"} />
					</div>
				) : (
					<div style={{ textAlign: "center", padding: "24px 0" }}>
						<p style={{ color: "#a09080", marginBottom: 12 }}>No profile details added yet.</p>
						<button style={btnGold} onClick={() => router.push("/profile/editProfile")}>
							<Edit2 size={14} /> Set Up Profile
						</button>
					</div>
				)}
			</div>

			{/* Address card */}
			<div style={{ ...cardStyle, marginBottom: 16 }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
					<h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-bg-dark)", display: "flex", alignItems: "center", gap: 6 }}>
						<MapPin size={16} style={{ color: "var(--color-primary)" }} /> Default Address
					</h2>
					<button
						style={btnGold}
						onClick={() => router.push("/profile/editAddress")}
						onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"; }}
						onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--color-primary)"; }}
					>
						<Edit2 size={14} /> Edit Address
					</button>
				</div>
				{defaultAddr ? (
					<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
						<InfoItem label="Street" value={defaultAddr.street ?? "—"} />
						<InfoItem label="City" value={defaultAddr.city ?? "—"} />
						<InfoItem label="District" value={defaultAddr.district ?? "—"} />
						<InfoItem label="State" value={defaultAddr.state ?? "—"} />
						<InfoItem label="Zip Code" value={defaultAddr.zipCode ?? "—"} />
						<InfoItem label="Country" value={defaultAddr.country ?? "—"} />
					</div>
				) : (
					<p style={{ color: "#a09080", textAlign: "center", padding: "16px 0" }}>No default address set.</p>
				)}
			</div>

			{/* Seller status card */}
			<div style={cardStyle}>
				<h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-bg-dark)", display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
					<Store size={16} style={{ color: "var(--color-primary)" }} /> Seller Status
				</h2>
				{profile.sellerProfile?.isApprovedByAdmin ? (
					<div style={{
						display: "flex", alignItems: "center", gap: 8,
						padding: "12px 16px", borderRadius: 8,
						backgroundColor: "rgba(34, 139, 34, 0.08)",
						border: "1px solid rgba(34, 139, 34, 0.2)",
						color: "#2d6a2d", fontWeight: 600, fontSize: 14,
					}}>
						<CheckCircle size={18} /> Approved Seller
					</div>
				) : profile.sellerProfile?.isRequestedForSeller ? (
					<div style={{
						display: "flex", alignItems: "center", gap: 8,
						padding: "12px 16px", borderRadius: 8,
						backgroundColor: "rgba(224, 161, 27, 0.08)",
						border: "1px solid rgba(224, 161, 27, 0.25)",
						color: "#9a7520", fontWeight: 600, fontSize: 14,
					}}>
						<Clock size={18} /> Application Pending Review
					</div>
				) : (
					<div style={{ textAlign: "center", padding: "12px 0" }}>
						<p style={{ color: "#a09080", marginBottom: 12, fontSize: 14 }}>Start selling your textiles on Srinibas Vastra</p>
						<button
							style={btnGold}
							onClick={() => router.push("/profile/applyForSeller")}
							onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"; }}
							onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--color-primary)"; }}
						>
							<Store size={14} /> Apply to be a Seller
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

function InfoItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
	return (
		<div>
			<p style={{ fontSize: 11, fontWeight: 600, color: "#a09080", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}>
				{icon} {label}
			</p>
			<p style={{ fontSize: 15, color: "var(--color-bg-dark)", fontWeight: 500 }}>{value}</p>
		</div>
	);
}
