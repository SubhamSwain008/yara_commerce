// ---------- Boutique Style Additions ----------
"use client";
const heroPatternOverlay = {
  position: "relative" as const,
  zIndex: 1,
  width: "100%",
  height: "100%",
  backgroundImage:
    "repeating-linear-gradient(135deg, rgba(224,161,27,0.07) 0px, rgba(224,161,27,0.07) 2px, transparent 2px, transparent 20px)",
  padding: 0,
};

const heroUnderline = {
  display: "block",
  width: 120,
  height: 6,
  margin: "18px auto 0 auto",
  background: "linear-gradient(90deg, #E0A11B 60%, #F2C94C 100%)",
  borderRadius: 6,
};

const btnPrimaryHover = {
  background: "linear-gradient(90deg, #C88912 60%, #E0A11B 100%)",
};

const categoryCardHover = {
  boxShadow: "0 6px 24px 0 rgba(224,161,27,0.18)",
  border: "2.5px solid #E0A11B",
};

const productCardHover = {
  boxShadow: "0 8px 32px 0 rgba(224,161,27,0.18)",
  border: "2.5px solid #E0A11B",
};

const productCardTexture = {
  backgroundImage: "repeating-linear-gradient(135deg, rgba(224,161,27,0.04) 0px, rgba(224,161,27,0.04) 2px, transparent 2px, transparent 18px)",
};

import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section style={heroSection}>
        <div style={heroPatternOverlay}>
          <div style={{ maxWidth: 900, margin: "auto" }}>
            <h1 style={heroTitle}>
              Srinibas Vastra
              <span style={heroUnderline}></span>
            </h1>
            <p style={heroSubtitle}>
              Where Tradition Meets Trend. Curated Sarees & Fashion for Every Occasion.
            </p>
            <Link href="/home">
              <button style={btnPrimary} onMouseOver={e => e.currentTarget.style.background = btnPrimaryHover.background} onMouseOut={e => e.currentTarget.style.background = btnPrimary.background}>Shop Now →</button>
            </Link>
          </div>
        </div>
      </section>

      <Divider />

      {/* CATEGORIES */}
      <section style={section}>
        <h2 style={sectionTitle}>Shop by Category</h2>
        <div style={grid}>
          <Category name="Sarees" icon="🧣" href="/products?category=saree" />
          <Category name="Men Wear" icon="👔" href="/products?category=men" />
          <Category name="Women Wear" icon="👗" href="/products?category=women" />
          <Category name="Accessories" icon="💍" href="/products?category=accessories" />
        </div>
      </section>

      <Divider />

      {/* FEATURED */}
      <section style={section}>
        <h2 style={sectionTitle}>Featured Collection</h2>
        <div style={grid}>
          <ProductCard name="Silk Saree" price="₹2,499" texture />
          <ProductCard name="Cotton Kurta" price="₹999" texture />
          <ProductCard name="Designer Blouse" price="₹799" texture />
          <ProductCard name="Casual Shirt" price="₹1,199" texture />
        </div>
      </section>

      <Divider />

      {/* ABOUT */}
      <section style={aboutSection}>
        <h2 style={sectionTitle}>Why Srinibas Vastra?</h2>
        <p style={aboutText}>
          We bring curated fashion that balances tradition and modern style.<br />
          Quality fabrics, fair prices, and designs you’ll actually wear.
        </p>
      </section>
    </main>
  );
}

/* ---------- Components ---------- */

function Category({ name, href, icon }: { name: string; href: string; icon: string }) {
  return (
    <Link href={href} style={categoryCard} onMouseOver={e => {
      e.currentTarget.style.boxShadow = categoryCardHover.boxShadow;
      e.currentTarget.style.border = categoryCardHover.border;
    }} onMouseOut={e => {
      e.currentTarget.style.boxShadow = categoryCard.boxShadow;
      e.currentTarget.style.border = categoryCard.border;
    }}>
      <div style={categoryIcon}>{icon}</div>
      <h3 style={{ margin: "10px 0 5px", fontSize: "1.1rem", color: "#2B1A12" }}>{name}</h3>
      <p style={{ margin: 0, fontSize: "0.9rem", color: "#E0A11B", fontWeight: 600 }}>Explore →</p>
    </Link>
  );
}

function ProductCard({ name, price, texture }: { name: string; price: string; texture?: boolean }) {
  return (
    <div style={{ ...productCard, ...(texture ? productCardTexture : {}) }}
      onMouseOver={e => {
        e.currentTarget.style.boxShadow = productCardHover.boxShadow;
        e.currentTarget.style.border = productCardHover.border;
      }}
      onMouseOut={e => {
        e.currentTarget.style.boxShadow = productCard.boxShadow;
        e.currentTarget.style.border = productCard.border;
      }}
    >
      <div style={imagePlaceholder}></div>
      <h4 style={{ margin: "12px 0 5px", fontSize: "1rem", color: "#2B1A12" }}>{name}</h4>
      <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#A51212" }}>{price}</p>
    </div>
  );
}

function Divider() {
  return (
    <div style={{
      width: "100%",
      height: 0,
      borderBottom: "2px dashed #E0A11B",
      margin: "40px 0 30px 0",
      opacity: 0.25,
    }} />
  );
}

/* ---------- Styles ---------- */

const heroSection = {
  padding: "100px 20px 80px",
  textAlign: "center" as const,
  background: "linear-gradient(135deg, #2B1A12 0%, #3A2416 100%)",
  color: "#F5E6C8",
};

const heroTitle = {
  fontSize: "3.5rem",
  marginBottom: 15,
  fontWeight: 700,
  letterSpacing: "-1px",
  color: "#E0A11B",
};

const heroSubtitle = {
  fontSize: "1.3rem",
  marginBottom: 35,
  opacity: 0.95,
  fontWeight: 300,
};

const section = {
  padding: "60px 20px",
  maxWidth: 1200,
  margin: "auto",
};

const sectionTitle = {
  fontSize: "2rem",
  marginBottom: 10,
  fontWeight: 600,
  textAlign: "center" as const,
  color: "#2B1A12",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 25,
  marginTop: 30,
};

const categoryCard = {
  background: "#FFF8E7",
  border: "2px solid #EAD7B0",
  borderRadius: 16,
  padding: 30,
  textAlign: "center" as const,
  textDecoration: "none",
  color: "#3A2416",
  transition: "all 0.3s ease",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(230, 161, 27, 0.1)",
} as const;

const categoryIcon = {
  fontSize: "2.5rem",
  marginBottom: 10,
};

const productCard = {
  background: "#FFF8E7",
  border: "1px solid #EAD7B0",
  borderRadius: 12,
  padding: 15,
  textAlign: "center" as const,
  transition: "all 0.3s ease",
  cursor: "pointer",
  boxShadow: "0 2px 12px rgba(224, 161, 27, 0.08)",
} as const;

const imagePlaceholder = {
  height: 180,
  background: "linear-gradient(135deg, #EAD7B0 0%, #E0A11B 100%)",
  borderRadius: 10,
  marginBottom: 10,
};

const btnPrimary = {
  padding: "14px 32px",
  background: "#E0A11B",
  color: "#2B1A12",
  border: "none",
  borderRadius: 25,
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 600,
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
};

const aboutSection = {
  padding: "60px 20px",
  textAlign: "center" as const,
  background: "#FFF8E7",
};

const aboutText = {
  maxWidth: 700,
  margin: "20px auto",
  lineHeight: 1.8,
  fontSize: "1.1rem",
  color: "#3A2416",
};
