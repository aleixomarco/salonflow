import Link from "next/link";

export default function SettingsPage() {
  return (
    <main style={styles.page}>
      <div style={styles.top}>
        <Link href="/" style={styles.back}>
          ← Zurück
        </Link>
      </div>

      <section style={styles.card}>
        <p style={styles.badge}>Setup</p>
        <h1 style={styles.title}>Einstellungen</h1>
        <p style={styles.text}>
          Später kannst du hier Salonname, Leistungen, Öffnungszeiten,
          WhatsApp-Nummer und blockierte Zeiten verwalten.
        </p>

        <div style={styles.box}>
          <strong>Nächster Schritt:</strong>
          <p>
            Diese Einstellungen verbinden wir später mit Supabase, damit sie online
            gespeichert werden.
          </p>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f7",
    padding: "32px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  top: {
    maxWidth: "760px",
    margin: "0 auto 20px",
  },
  back: {
    color: "#0071e3",
    textDecoration: "none",
    fontWeight: 700,
  },
  card: {
    maxWidth: "760px",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "34px",
    padding: "34px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.08)",
  },
  badge: {
    color: "#0071e3",
    fontWeight: 900,
  },
  title: {
    fontSize: "52px",
    letterSpacing: "-0.06em",
    margin: "0 0 12px",
  },
  text: {
    color: "#6e6e73",
    fontSize: "18px",
    lineHeight: 1.5,
  },
  box: {
    marginTop: "28px",
    padding: "22px",
    borderRadius: "24px",
    background: "#f5f5f7",
  },
};