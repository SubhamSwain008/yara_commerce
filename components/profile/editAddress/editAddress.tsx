"use client";

import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Plus, Trash2, Edit2, CheckCircle, MapPin, Loader2, Save, X } from "lucide-react";

interface Address {
  id: string;
  district: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  isDefault: boolean;
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
const btnGold: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "10px 20px", backgroundColor: "var(--color-primary)",
  color: "var(--color-bg-dark)", border: "none", borderRadius: 10,
  fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all .2s",
};

export default function EditAddress() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [form, setForm] = useState({ district: "", street: "", city: "", state: "", zipCode: "", country: "", isDefault: false });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/user/adress");
      setAddresses(res.data.addresses || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({ district: addr.district ?? "", street: addr.street ?? "", city: addr.city ?? "", state: addr.state ?? "", zipCode: addr.zipCode ?? "", country: addr.country ?? "", isDefault: addr.isDefault });
    setShowForm(true); setError(null); setSuccess(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      setActionLoading(id);
      await axios.delete(`/api/user/adress?id=${id}`);
      setAddresses(addresses.filter((a) => a.id !== id));
      setSuccess("Address deleted successfully");
    } catch (err: any) { setError(err?.response?.data?.error || "Failed to delete address"); } finally { setActionLoading(null); }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setActionLoading(id);
      await axios.put("/api/user/adress", { id, isDefault: true });
      setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
      setSuccess("Default address updated");
    } catch (err: any) { setError(err?.response?.data?.error || "Failed to set default address"); } finally { setActionLoading(null); }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm({ district: "", street: "", city: "", state: "", zipCode: "", country: "", isDefault: addresses.length === 0 });
    setShowForm(true); setError(null); setSuccess(null);
  };

  const handleCancel = () => { setShowForm(false); setEditingId(null); setError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("form"); setError(null); setSuccess(null);
    try {
      const payload: any = { ...form };
      Object.keys(payload).forEach(key => { if (typeof payload[key] === 'string' && payload[key].trim() === '') payload[key] = null; });
      Object.keys(payload).forEach(key => { if (typeof payload[key] === 'string') payload[key] = payload[key].trim(); });

      let res: AxiosResponse;
      if (editingId) {
        res = await axios.put("/api/user/adress", { ...payload, id: editingId });
        setAddresses(addresses.map(a => a.id === editingId ? res.data.address : (res.data.address.isDefault ? { ...a, isDefault: false } : a)));
        setSuccess("Address updated successfully");
      } else {
        res = await axios.post("/api/user/adress", payload);
        if (res.data.address.isDefault) setAddresses([...addresses.map(a => ({ ...a, isDefault: false })), res.data.address]);
        else setAddresses([...addresses, res.data.address]);
        setSuccess("Address added successfully");
      }
      setShowForm(false); setEditingId(null);
    } catch (err: any) { setError(err?.response?.data?.error || err.message || "Operation failed"); } finally { setActionLoading(null); }
  };

  if (loading && addresses.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
        <Loader2 className="animate-spin" size={28} style={{ color: "var(--color-primary)" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-bg-dark)", display: "flex", alignItems: "center", gap: 8 }}>
          <MapPin size={20} style={{ color: "var(--color-primary)" }} /> Your Addresses
        </h2>
        {!showForm && (
          <button style={btnGold} onClick={handleAddNew}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--color-primary)"}
          >
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      {error && <div style={{ padding: 12, backgroundColor: "rgba(165,18,18,0.06)", border: "1px solid rgba(165,18,18,0.15)", color: "var(--color-secondary)", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{error}</div>}
      {success && <div style={{ padding: 12, backgroundColor: "rgba(34,139,34,0.06)", border: "1px solid rgba(34,139,34,0.15)", color: "#2d6a2d", borderRadius: 10, fontSize: 13, marginBottom: 16 }}>{success}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: "var(--color-bg-light)", border: "1px solid #e8dcc8", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-bg-dark)", marginBottom: 20 }}>
            {editingId ? "Edit Address" : "New Address"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div><label style={labelStyle}>Street *</label><input name="street" value={form.street} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
            <div><label style={labelStyle}>City *</label><input name="city" value={form.city} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
            <div><label style={labelStyle}>District</label><input name="district" value={form.district} onChange={handleChange} style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
            <div><label style={labelStyle}>State *</label><input name="state" value={form.state} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
            <div><label style={labelStyle}>ZIP Code *</label><input name="zipCode" value={form.zipCode} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
            <div><label style={labelStyle}>Country *</label><input name="country" value={form.country} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"} onBlur={(e) => e.target.style.borderColor = "#d4c4a8"} /></div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, cursor: "pointer" }}>
            <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} style={{ width: 16, height: 16, accentColor: "var(--color-primary)" }} />
            <span style={{ fontSize: 13, color: "#8a7560" }}>Set as default address</span>
          </label>

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button type="submit" disabled={actionLoading === "form"} style={{ ...btnGold, opacity: actionLoading === "form" ? 0.6 : 1 }}
              onMouseEnter={(e) => { if (actionLoading !== "form") e.currentTarget.style.backgroundColor = "var(--color-primary-hover)"; }}
              onMouseLeave={(e) => { if (actionLoading !== "form") e.currentTarget.style.backgroundColor = "var(--color-primary)"; }}
            >
              <Save size={14} /> {actionLoading === "form" ? "Saving..." : "Save Address"}
            </button>
            <button type="button" onClick={handleCancel} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", backgroundColor: "transparent", border: "1.5px solid #d4c4a8", color: "#8a7560", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              <X size={14} /> Cancel
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <div style={{ display: "grid", gap: 12 }}>
          {addresses.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", backgroundColor: "rgba(224,161,27,0.04)", borderRadius: 14, border: "1px dashed var(--color-border)", color: "#8a7560" }}>
              No addresses found. Add one to get started.
            </div>
          ) : (
            addresses.map((addr) => (
              <div key={addr.id}
                style={{
                  position: "relative", padding: 20, borderRadius: 14,
                  border: addr.isDefault ? "1.5px solid var(--color-primary)" : "1px solid #e8dcc8",
                  backgroundColor: addr.isDefault ? "rgba(224,161,27,0.03)" : "var(--color-bg-light)",
                  transition: "all .2s",
                }}
              >
                {addr.isDefault && (
                  <div style={{
                    position: "absolute", top: 12, right: 12,
                    display: "flex", alignItems: "center", gap: 4,
                    fontSize: 11, fontWeight: 600, color: "var(--color-primary)",
                    backgroundColor: "rgba(224,161,27,0.1)",
                    padding: "3px 10px", borderRadius: 50,
                  }}>
                    <CheckCircle size={12} /> Default
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <MapPin size={18} style={{ color: "var(--color-primary)", marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "var(--color-bg-dark)" }}>{addr.street || "No street"}</p>
                    <p style={{ fontSize: 13, color: "#8a7560" }}>{addr.city}, {addr.state} {addr.zipCode}</p>
                    <p style={{ fontSize: 13, color: "#a09080" }}>{addr.country}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 12, borderTop: "1px solid #ede4d4" }}>
                  <button onClick={() => handleEdit(addr)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr.id)} disabled={actionLoading === addr.id}
                      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#8a7560", background: "none", border: "none", cursor: "pointer" }}>
                      {actionLoading === addr.id ? "Setting..." : "Set Default"}
                    </button>
                  )}
                  <button onClick={() => handleDelete(addr.id)} disabled={actionLoading === addr.id}
                    style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--color-secondary)", background: "none", border: "none", cursor: "pointer", marginLeft: "auto" }}>
                    <Trash2 size={13} /> {actionLoading === addr.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
