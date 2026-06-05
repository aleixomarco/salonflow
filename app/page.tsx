import Link from "next/link";

export default function Home() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.badge}>SalonFlow Barber App</p>

        <h1 style={styles.title}>
          Termine anfragen. <br />
          Barber bestätigt.
        </h1>

        <p style={styles.text}>
          Eine einfache Buchungs-App für Barbershops: Kunden fragen Termine an,
          der Barber bestätigt sie im Dashboard.
        </p>

        <div style={styles.actions}>
          <Link href="/book" style={styles.primaryButton}>
            Termin anfragen
          </Link>

          <Link href="/barber" style={styles.secondaryButton}>
            Barber Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f7",
    color: "#111",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },
  hero: {
    maxWidth: "900px",
    textAlign: "center" as const,
  },
  badge: {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: "999px",
    background: "#fff",
    color: "#6e6e73",
    fontWeight: 700,
    marginBottom: "24px",
  },
  title: {
    fontSize: "clamp(48px, 8vw, 96px)",
    lineHeight: "0.95",
    letterSpacing: "-0.06em",
    margin: 0,
  },
  text: {
    maxWidth: "650px",
    margin: "28px auto 0",
    color: "#6e6e73",
    fontSize: "22px",
    lineHeight: 1.4,
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap" as const,
    marginTop: "36px",
  },
  primaryButton: {
    padding: "14px 22px",
    borderRadius: "999px",
    background: "#25d366",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 800,
  },
  secondaryButton: {
    padding: "14px 22px",
    borderRadius: "999px",
    background: "#fff",
    color: "#111",
    textDecoration: "none",
    fontWeight: 800,
    border: "1px solid rgba(0,0,0,0.08)",
  },
};