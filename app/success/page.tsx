import Link from "next/link";

export default function SuccessPage() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.successCircle}>
          <span style={styles.checkmark}>✓</span>
        </div>

        <p style={styles.badge}>Anfrage erfolgreich gesendet</p>

        <h1 style={styles.title}>
          Dein Terminwunsch ist beim Friseur angekommen.
        </h1>

        <p style={styles.text}>
          Vielen Dank für deine Anfrage. Der Termin ist noch nicht final bestätigt.
          Der Friseur prüft deine Anfrage und meldet sich so schnell wie möglich bei dir.
        </p>

        <div style={styles.infoBox}>
          <strong>Was passiert jetzt?</strong>

          <div style={styles.steps}>
            <div style={styles.step}>
              <span style={styles.stepNumber}>1</span>
              <p>Deine Anfrage wurde gespeichert.</p>
            </div>

            <div style={styles.step}>
              <span style={styles.stepNumber}>2</span>
              <p>Der Friseur prüft Datum, Uhrzeit und Leistung.</p>
            </div>

            <div style={styles.step}>
              <span style={styles.stepNumber}>3</span>
              <p>Du bekommst eine Rückmeldung zur Bestätigung.</p>
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <Link href="/status" style={styles.primaryButton}>
            Status ansehen
          </Link>

          <Link href="/book" style={styles.secondaryButton}>
            Weitere Anfrage senden
          </Link>
        </div>
      </section>

      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>
    </main>
  );
}

const styles = {
  page: {
    position: "relative" as const,
    minHeight: "100vh",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 50% 0%, rgba(37, 211, 102, 0.18), transparent 35%), linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    position: "relative" as const,
    zIndex: 2,
    width: "min(760px, 100%)",
    background: "rgba(255,255,255,0.84)",
    backdropFilter: "blur(22px)",
    WebkitBackdropFilter: "blur(22px)",
    border: "1px solid rgba(255,255,255,0.8)",
    borderRadius: "42px",
    padding: "48px 34px",
    textAlign: "center" as const,
    boxShadow: "0 30px 100px rgba(0,0,0,0.10)",
    animation: "successCardIn 0.8s ease forwards",
  },
  successCircle: {
    width: "96px",
    height: "96px",
    margin: "0 auto 24px",
    borderRadius: "50%",
    background: "#25d366",
    display: "grid",
    placeItems: "center",
    color: "#fff",
    boxShadow: "0 18px 50px rgba(37, 211, 102, 0.35)",
    animation: "successPulse 1.8s ease-in-out infinite",
  },
  checkmark: {
    fontSize: "52px",
    fontWeight: 900,
    lineHeight: 1,
  },
  badge: {
    display: "inline-flex",
    padding: "9px 14px",
    borderRadius: "999px",
    background: "rgba(37, 211, 102, 0.10)",
    color: "#0c7a34",
    fontSize: "14px",
    fontWeight: 900,
    margin: "0 0 20px",
  },
  title: {
    maxWidth: "680px",
    margin: "0 auto",
    fontSize: "clamp(40px, 6vw, 72px)",
    lineHeight: "0.98",
    letterSpacing: "-0.065em",
    color: "#0b0b0f",
  },
  text: {
    maxWidth: "620px",
    margin: "24px auto 0",
    color: "#6e6e73",
    fontSize: "20px",
    lineHeight: 1.45,
    letterSpacing: "-0.025em",
    fontWeight: 600,
  },
  infoBox: {
    margin: "34px auto 0",
    maxWidth: "560px",
    padding: "24px",
    borderRadius: "28px",
    background: "#f5f5f7",
    textAlign: "left" as const,
  },
  steps: {
    display: "grid",
    gap: "14px",
    marginTop: "18px",
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#1d1d1f",
    fontWeight: 700,
  },
  stepNumber: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#fff",
    display: "grid",
    placeItems: "center",
    color: "#25d366",
    fontWeight: 950,
    flex: "0 0 auto",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap" as const,
    marginTop: "34px",
  },
  primaryButton: {
    padding: "15px 22px",
    borderRadius: "999px",
    background: "#25d366",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 900,
    boxShadow: "0 14px 38px rgba(37, 211, 102, 0.25)",
  },
  secondaryButton: {
    padding: "15px 22px",
    borderRadius: "999px",
    background: "#fff",
    color: "#111",
    textDecoration: "none",
    fontWeight: 900,
    border: "1px solid rgba(0,0,0,0.08)",
  },
  glowOne: {
    position: "absolute" as const,
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background: "rgba(37, 211, 102, 0.16)",
    filter: "blur(40px)",
    top: "8%",
    left: "8%",
    animation: "floatGlow 6s ease-in-out infinite",
  },
  glowTwo: {
    position: "absolute" as const,
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background: "rgba(0, 113, 227, 0.13)",
    filter: "blur(40px)",
    right: "8%",
    bottom: "8%",
    animation: "floatGlow 7s ease-in-out infinite reverse",
  },
};