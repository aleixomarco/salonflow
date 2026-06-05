"use client";

import { useState } from "react";
import Link from "next/link";

export default function MembershipPage() {
  const [fullName, setFullName] = useState("");
  const [salonName, setSalonName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName || !salonName || !legalName || !phone || !email || !address) {
      alert("Bitte fülle alle Felder aus.");
      return;
    }

    setIsSubmitting(true);

    // Daten als URL-Parameter an PayPal übergeben (für deine Aufzeichnung)
    const params = new URLSearchParams({
      cmd: "_xclick-subscriptions",
      business: "aleixo.marco@idbranding.de", // ← hier deine PayPal-E-Mail eintragen
      item_name: `SalonFlow Mitgliedschaft – ${salonName}`,
      a3: "29.00",
      p3: "1",
      t3: "M",
      src: "1",
      currency_code: "EUR",
      no_note: "1",
      custom: encodeURIComponent(
        JSON.stringify({ fullName, salonName, legalName, phone, email, address })
      ),
      return: `${window.location.origin}/membership/success`,
      cancel_return: `${window.location.origin}/membership`,
    });

    window.location.href = `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
  }

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
          <div style={styles.appIcon}>★</div>

          <p style={styles.badge}>Mitgliedschaft</p>

          <h1 style={styles.title}>
            Salon
            <br />
            anmelden.
          </h1>

          <p style={styles.text}>
            Registriere deinen Salon bei SalonFlow. Nach erfolgreicher Zahlung
            erhältst du deine Zugangsdaten per E-Mail.
          </p>

          <div style={styles.priceBadge}>
            <span style={styles.priceAmount}>29 €</span>
            <span style={styles.pricePer}> / Monat</span>
          </div>
        </div>

        <div style={styles.infoBox}>
          <strong>Was ist enthalten?</strong>
          <p>
            Eigenes Barber-Dashboard · Terminverwaltung · WhatsApp-Integration ·
            Buchungsseite für Kunden · Monatlich kündbar
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Vollständiger Name (Inhaber)
            <input
              style={styles.input}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Max Mustermann"
            />
          </label>

          <label style={styles.label}>
            Name des Salons
            <input
              style={styles.input}
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}
              required
              placeholder="Barber Kings"
            />
          </label>

          <label style={styles.label}>
            Offizieller Firmenname (Firmierung)
            <input
              style={styles.input}
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              required
              placeholder="Barber Kings GmbH"
            />
          </label>

          <label style={styles.label}>
            Telefonnummer
            <input
              style={styles.input}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+49 176 12345678"
            />
          </label>

          <label style={styles.label}>
            E-Mail-Adresse
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="info@barberkings.de"
            />
          </label>

          <label style={styles.label}>
            Adresse des Salons
            <input
              style={styles.input}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Musterstraße 1, 12345 Berlin"
            />
          </label>

          <button
            style={{
              ...styles.button,
              opacity: isSubmitting ? 0.65 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Weiterleitung..." : "Weiter zu PayPal →"}
          </button>

          <p style={styles.hint}>
            Nach der Zahlung richten wir deinen Account manuell ein und senden
            dir die Zugangsdaten an deine E-Mail-Adresse.
          </p>
        </form>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.18), transparent 34%), linear-gradient(180deg, #08080b 0%, #111116 100%)",
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
    maxHeight: "calc(100vh - 48px)",
    overflowY: "auto" as const,
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
      "radial-gradient(circle at 80% 0%, rgba(99,102,241,0.35), transparent 36%), #15151d",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
  },
  appIcon: {
    width: "66px",
    height: "66px",
    borderRadius: "22px",
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #6366f1 0%, #a5b4fc 55%, #4338ca 100%)",
    color: "#fff",
    fontSize: "30px",
    fontWeight: 950,
    marginBottom: "24px",
  },
  badge: {
    margin: 0,
    color: "#a5b4fc",
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
    color: "#f0f0ff",
  },
  text: {
    margin: "20px 0 0",
    color: "rgba(240,240,255,0.72)",
    fontSize: "17px",
    lineHeight: 1.45,
    fontWeight: 600,
  },
  priceBadge: {
    marginTop: "20px",
    display: "inline-flex",
    alignItems: "baseline",
    gap: "4px",
    padding: "10px 18px",
    borderRadius: "999px",
    background: "rgba(99,102,241,0.22)",
    border: "1px solid rgba(99,102,241,0.40)",
  },
  priceAmount: {
    fontSize: "28px",
    fontWeight: 950,
    color: "#c4b5fd",
    letterSpacing: "-0.04em",
  },
  pricePer: {
    fontSize: "15px",
    fontWeight: 800,
    color: "rgba(196,181,253,0.72)",
  },
  infoBox: {
    marginTop: "16px",
    padding: "18px",
    borderRadius: "28px",
    background: "rgba(99,102,241,0.10)",
    border: "1px solid rgba(99,102,241,0.20)",
    color: "#e0e7ff",
    lineHeight: 1.6,
    fontSize: "14px",
  },
  form: {
    display: "grid",
    gap: "14px",
    marginTop: "16px",
    padding: "18px",
    borderRadius: "32px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  label: {
    display: "grid",
    gap: "8px",
    color: "rgba(240,240,255,0.85)",
    fontSize: "13px",
    fontWeight: 900,
  },
  input: {
    width: "100%",
    padding: "15px 16px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "#f0f0ff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  button: {
    padding: "16px 22px",
    borderRadius: "999px",
    border: 0,
    background:
      "linear-gradient(135deg, #6366f1 0%, #a5b4fc 50%, #4338ca 100%)",
    color: "#fff",
    fontWeight: 950,
    fontSize: "16px",
    boxShadow: "0 18px 50px rgba(99,102,241,0.30)",
  },
  hint: {
    margin: 0,
    color: "rgba(240,240,255,0.45)",
    fontSize: "12px",
    lineHeight: 1.5,
    textAlign: "center" as const,
    fontWeight: 700,
  },
  glowOne: {
    position: "absolute" as const,
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "rgba(99,102,241,0.20)",
    filter: "blur(80px)",
    top: "-120px",
    left: "20%",
  },
  glowTwo: {
    position: "absolute" as const,
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background: "rgba(212,175,55,0.10)",
    filter: "blur(80px)",
    bottom: "-90px",
    right: "18%",
  },
};