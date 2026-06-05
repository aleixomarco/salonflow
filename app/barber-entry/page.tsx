import Link from "next/link";

export default function BarberEntryPage() {
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
          <div style={styles.appIcon}>◆</div>

          <p style={styles.badge}>Barber-Bereich</p>

          <h1 style={styles.title}>
            Für
            <br />
            Barbershops.
          </h1>

          <p style={styles.text}>
            Melde dich in deinem bestehenden Konto an oder registriere deinen
            Salon neu bei SalonFlow.
          </p>
        </div>

        <div style={styles.optionGrid}>
          <Link href="/login" style={styles.optionPrimary}>
            <div style={styles.optionIcon}>◆</div>
            <div>
              <strong style={styles.optionTitle}>Einloggen</strong>
              <p style={styles.optionText}>
                Du hast bereits einen Account? Hier geht's zu deinem Dashboard.
              </p>
            </div>
          </Link>

          <Link href="/membership" style={styles.optionSecondary}>
            <div style={styles.optionIconPurple}>★</div>
            <div>
              <strong style={styles.optionTitle}>Neue Mitgliedschaft</strong>
              <p style={styles.optionText}>
                Noch kein Konto? Melde deinen Salon an — ab 29 €/Monat.
              </p>
            </div>
          </Link>
        </div>

        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            Der Barber-Bereich ist ausschließlich für Saloninhaber und
            Mitarbeiter. Kunden buchen über die Startseite.
          </p>
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
    marginBottom: "16px",
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
    fontSize: "52px",
    lineHeight: "0.92",
    letterSpacing: "-0.065em",
    color: "#fffaf0",
  },
  text: {
    margin: "20px 0 0",
    color: "rgba(255,250,240,0.72)",
    fontSize: "17px",
    lineHeight: 1.45,
    fontWeight: 600,
  },
  optionGrid: {
    display: "grid",
    gap: "12px",
    marginBottom: "16px",
  },
  optionPrimary: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "22px",
    borderRadius: "28px",
    background:
      "linear-gradient(145deg, rgba(212,175,55,0.22), rgba(255,255,255,0.06))",
    border: "1px solid rgba(212,175,55,0.30)",
    textDecoration: "none",
    color: "#fff",
  },
  optionSecondary: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "22px",
    borderRadius: "28px",
    background:
      "linear-gradient(145deg, rgba(99,102,241,0.20), rgba(255,255,255,0.05))",
    border: "1px solid rgba(99,102,241,0.28)",
    textDecoration: "none",
    color: "#fff",
  },
  optionIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    background: "rgba(212,175,55,0.25)",
    color: "#ffe88a",
    fontSize: "20px",
    fontWeight: 950,
    flexShrink: 0,
  },
  optionIconPurple: {
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    background: "rgba(99,102,241,0.28)",
    color: "#c4b5fd",
    fontSize: "20px",
    fontWeight: 950,
    flexShrink: 0,
  },
  optionTitle: {
    display: "block",
    fontSize: "20px",
    fontWeight: 950,
    letterSpacing: "-0.03em",
    color: "#fffaf0",
    marginBottom: "6px",
  },
  optionText: {
    margin: 0,
    fontSize: "14px",
    color: "rgba(255,250,240,0.65)",
    lineHeight: 1.45,
    fontWeight: 700,
  },
  infoBox: {
    padding: "16px 20px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  infoText: {
    margin: 0,
    fontSize: "13px",
    color: "rgba(255,255,255,0.40)",
    lineHeight: 1.5,
    fontWeight: 700,
    textAlign: "center" as const,
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