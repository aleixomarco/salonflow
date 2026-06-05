import Link from "next/link";

export default function SuccessPage() {
  return (
    <main style={styles.page}>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <section style={styles.appShell}>
        <div style={styles.statusBar}>
          <span>09:41</span>
          <span>SalonFlow</span>
        </div>

        <div style={styles.successCard}>
          <div style={styles.successCircle}>
            <span style={styles.checkmark}>✓</span>
          </div>

          <p style={styles.badge}>Anfrage erfolgreich gesendet</p>

          <h1 style={styles.title}>
            Dein Terminwunsch ist angekommen.
          </h1>

          <p style={styles.text}>
            Der Barber prüft deine Anfrage. Dein Termin ist erst bestätigt,
            wenn du eine Rückmeldung erhältst.
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
                <p>Der Barber prüft Datum, Uhrzeit und Leistung.</p>
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
              Neue Anfrage
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% 0%, rgba(37,211,102,0.18), transparent 34%), linear-gradient(180deg, #08080b 0%, #111116 100%)",
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
  successCard: {
    borderRadius: "34px",
    padding: "34px 24px",
    background:
      "radial-gradient(circle at 80% 0%, rgba(37,211,102,0.28), transparent 36%), #15151d",
    textAlign: "center" as const,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
    animation: "successCardIn 0.8s ease forwards",
  },
  successCircle: {
    width: "88px",
    height: "88px",
    margin: "0 auto 24px",
    borderRadius: "50%",
    background: "#25d366",
    display: "grid",
    placeItems: "center",
    color: "#fff",
    boxShadow: "0 18px 50px rgba(37,211,102,0.35)",
    animation: "successPulse 1.8s ease-in-out infinite",
  },
  checkmark: {
    fontSize: "48px",
    fontWeight: 950,
    lineHeight: 1,
  },
  badge: {
    display: "inline-flex",
    padding: "9px 14px",
    borderRadius: "999px",
    background: "rgba(37,211,102,0.14)",
    color: "#86efac",
    fontSize: "12px",
    fontWeight: 950,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    margin: "0 0 18px",
  },
  title: {
    margin: "0 auto",
    fontSize: "42px",
    lineHeight: "0.98",
    letterSpacing: "-0.065em",
    color: "#fff",
  },
  text: {
    margin: "20px auto 0",
    color: "rgba(255,255,255,0.62)",
    fontSize: "16px",
    lineHeight: 1.45,
    fontWeight: 600,
  },
  infoBox: {
    margin: "28px auto 0",
    padding: "20px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.10)",
    textAlign: "left" as const,
    color: "#fff",
  },
  steps: {
    display: "grid",
    gap: "12px",
    marginTop: "16px",
  },
  step: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "rgba(255,255,255,0.78)",
    fontWeight: 700,
  },
  stepNumber: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "rgba(37,211,102,0.16)",
    display: "grid",
    placeItems: "center",
    color: "#86efac",
    fontWeight: 950,
    flex: "0 0 auto",
  },
  actions: {
    display: "grid",
    gap: "12px",
    marginTop: "28px",
  },
  primaryButton: {
    padding: "16px 20px",
    borderRadius: "999px",
    background:
      "linear-gradient(135deg, #d4af37 0%, #fff1a6 50%, #b8860b 100%)",
    color: "#08080b",
    textDecoration: "none",
    textAlign: "center" as const,
    fontWeight: 950,
    boxShadow: "0 18px 50px rgba(212,175,55,0.22)",
  },
  secondaryButton: {
    padding: "16px 20px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    textDecoration: "none",
    textAlign: "center" as const,
    fontWeight: 900,
    border: "1px solid rgba(255,255,255,0.12)",
  },
  glowOne: {
    position: "absolute" as const,
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "rgba(37,211,102,0.18)",
    filter: "blur(80px)",
    top: "-120px",
    left: "20%",
  },
  glowTwo: {
    position: "absolute" as const,
    width: "360px",
    height: "360px",
    borderRadius: "50%",
    background: "rgba(212,175,55,0.14)",
    filter: "blur(80px)",
    bottom: "-90px",
    right: "18%",
  },
};