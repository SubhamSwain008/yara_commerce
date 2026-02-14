"use client";

import EditProfilePage from "@/components/profile/editProfile/editProfile";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function EditProfilePageShow() {
  const router = useRouter();

  return (
    <div style={{ padding: "32px 24px", maxWidth: 800, margin: "0 auto" }}>
      <button
        onClick={() => router.back()}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 16px", borderRadius: 8,
          border: "1px solid #d4c4a8", backgroundColor: "transparent",
          color: "#8a7560", fontSize: 13, fontWeight: 600,
          cursor: "pointer", marginBottom: 24, transition: "all .2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(224,161,27,0.06)"; e.currentTarget.style.borderColor = "var(--color-primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#d4c4a8"; }}
      >
        <ArrowLeft size={16} /> Back
      </button>
      <EditProfilePage />
    </div>
  );
}
