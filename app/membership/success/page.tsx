import Link from "next/link";

export default function MembershipSuccessPage() {
  return (
    <main style={styles.page}>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <section style={styles.card}>
        <div style={styles.icon}>★</div>

        <p style={styles.badge}>Mitgliedschaft</p>

        <h1 style={styles.title}>Willkommen bei SalonFlow.</h1>

        <p style={styles.text}>
          Deine Zahlung war erfolgreich. Wir richten deinen Salon-Account
          innerhalb von 24 Stunden ein und senden dir die Zugangsdaten per
          E-Mail.
        </p>

        <Link href="/" style={styles.button}>
          Zurück zur Startseite
        </Link>
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
  card: {
    position: "relative" as const,
    zIndex: 2,
    width: "min(430px, 100%)",
    borderRadius: "46px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 40px 140px rgba(0,0,0,0.45)",
    padding: "34px",
    backdropFilter: "blur(30px)",
    textAlign: "center" as const,
  },
  icon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #6366f1 0%, #a5b4fc 55%, #4338ca 100%)",
    color: "#fff",
    fontSize: "36px",
    fontWeight: 950,
    margin: "0 auto 24px",
    boxShadow: "0 16px 50px rgba(99,102,241,0.35)",
  },
  badge: {
    margin: "0 0 12px",
    color: "#a5b4fc",
    fontSize: "13px",
    fontWeight: 950,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  },
  title: {
    margin: "0 0 16px",
    fontSize: "38px",
    lineHeight: 1,
    letterSpacing: "-0.055em",
    color: "#f0f0ff",
  },
  text: {
    color: "rgba(240,240,255,0.72)",
    fontSize: "17px",
    lineHeight: 1.5,
    fontWeight: 600,
    marginBottom: "28px",
  },
  button: {
    display: "block",
    padding: "16px 22px",
    borderRadius: "999px",
    background:
      "linear-gradient(135deg, #6366f1 0%, #a5b4fc 50%, #4338ca 100%)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 950,
    fontSize: "16px",
    boxShadow: "0 18px 50px rgba(99,102,241,0.30)",
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