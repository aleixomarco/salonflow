"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [language, setLanguage] = useState("Deutsch");

  return (
    <main style={styles.page}>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <section style={styles.appShell}>
        <div style={styles.statusBar}>
          <Link href="/" style={styles.statusLink}>
            ← Home
          </Link>

          <span>SalonFlow</span>
        </div>

        <div style={styles.heroCard}>
          <div style={styles.appIcon}>⚙︎</div>

          <p style={styles.badge}>Setup</p>

          <h1 style={styles.title}>
            App
            <br />
            Einstellungen.
          </h1>

          <p style={styles.text}>
            Verwalte deine App.
          </p>
        </div>

        <div style={styles.settingCard}>
          <span style={styles.settingBadge}>Sprache</span>

          <h3 style={styles.cardTitle}>App-Sprache</h3>

          <p style={styles.cardText}>
            Wähle die Sprache, in der deine App angezeigt werden soll.
          </p>

          <label style={styles.selectLabel}>
            Sprache auswählen
            <select
              style={styles.select}
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="Deutsch">Deutsch</option>
            </select>
          </label>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.18), transparent 34%), linear-gradient(180deg, #08080b 0%, #111116 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#fff",
    position: "relative" as const,
    overflow: "hidden",
  },

  appShell: {
    position: "relative" as const,
    zIndex: 2,
    width: "min(430px, 100%)",
    minHeight: "760px",
    borderRadius: "46px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 40px 140px rgba(0,0,0,0.45)",
    padding: "22px",
    backdropFilter: "blur(30px)",
  },

  statusBar: {
    display: "flex",
    justifyContent: "space-between",
    color: "rgba(255,255,255,0.72)",
    fontSize: "13px",
    fontWeight: 800,
    marginBottom: "18px",
  },

  statusLink: {
    color: "rgba(255,255,255,0.72)",
    textDecoration: "none",
  },

  heroCard: {
    borderRadius: "34px",
    padding: "30px 24px",
    background:
      "radial-gradient(circle at 80% 0%, rgba(212,175,55,0.28), transparent 36%), #15151d",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
  },

  appIcon: {
    width: "66px",
    height: "66px",
    borderRadius: "22px",
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #d4af37 0%, #fff1a6 55%, #b8860b 100%)",
    color: "#08080b",
    fontSize: "30px",
    fontWeight: 950,
    marginBottom: "24px",
  },

  badge: {
    margin: 0,
    color: "#d4af37",
    fontSize: "13px",
    fontWeight: 950,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },

  title: {
    margin: "12px 0 0",
    fontSize: "48px",
    lineHeight: "0.92",
    letterSpacing: "-0.065em",
  },

  text: {
    margin: "20px 0 0",
    color: "rgba(255,255,255,0.62)",
    fontSize: "17px",
    lineHeight: 1.45,
    fontWeight: 600,
  },

  settingCard: {
    marginTop: "16px",
    padding: "22px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(20px)",
  },

  settingBadge: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(212,175,55,0.16)",
    color: "#fff1a6",
    fontSize: "12px",
    fontWeight: 900,
  },

  cardTitle: {
    margin: "14px 0 8px",
    color: "#fffaf0",
    fontSize: "22px",
    fontWeight: 900,
  },

  cardText: {
    color: "rgba(255,250,240,0.75)",
    fontSize: "15px",
    lineHeight: 1.5,
  },

  selectLabel: {
    display: "grid",
    gap: "10px",
    marginTop: "18px",
    color: "rgba(255,250,240,0.85)",
    fontSize: "13px",
    fontWeight: 900,
  },

  select: {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "18px",
    padding: "14px",
    background: "rgba(255,255,255,0.10)",
    color: "#fffaf0",
    fontSize: "15px",
    fontWeight: 800,
    outline: "none",
  },

  glowOne: {
    position: "absolute" as const,
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "rgba(212,175,55,0.18)",
    filter: "blur(80px)",
    top: "-120px",
    left: "20%",
  },

  glowTwo: {
    position: "absolute" as const,
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background: "rgba(99,102,241,0.14)",
    filter: "blur(80px)",
    bottom: "-90px",
    right: "18%",
  },
};