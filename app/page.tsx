import Link from "next/link";

export default function Home() {
  return (
    <main style={styles.page}>
      <section style={styles.appShell}>
        <div style={styles.statusBar}>
          <span>09:41</span>
          <span>SalonFlow</span>
        </div>

        <div style={styles.heroCard}>
          <div style={styles.appIcon}>S</div>

          <p style={styles.badge}>Barber Booking App</p>

          <h1 style={styles.title}>
            Dein Termin.
            <br />
            Direkt in der App.
          </h1>

          <p style={styles.text}>
            Frage deinen Termin an, prüfe deinen Status oder öffne das Barber-Dashboard.
            Alles an einem Ort.
          </p>

          <div style={styles.mainActions}>
            <Link href="/book" style={styles.primaryButton}>
              Termin anfragen
            </Link>

            <Link href="/status" style={styles.secondaryButton}>
              Status prüfen
            </Link>
          </div>
        </div>

        <div style={styles.quickGrid}>
          <Link href="/book" style={styles.tile}>
            <span style={styles.tileIcon}>✂︎</span>
            <strong>Termin</strong>
            <small>Anfrage senden</small>
          </Link>

          <Link href="/status" style={styles.tile}>
            <span style={styles.tileIcon}>●</span>
            <strong>Status</strong>
            <small>Prüfen</small>
          </Link>

          <Link href="/login" style={styles.tileDark}>
            <span style={styles.tileIconGold}>◆</span>
            <strong>Barber</strong>
            <small>Login</small>
          </Link>

          <Link href="/settings" style={styles.tile}>
            <span style={styles.tileIcon}>⚙︎</span>
            <strong>Setup</strong>
            <small>Einstellungen</small>
          </Link>
        </div>

        <div style={styles.todayCard}>
          <div>
            <span style={styles.smallLabel}>Heute</span>
            <h2 style={styles.cardTitle}>Live Booking Flow</h2>
            <p style={styles.cardText}>
              Kunden fragen an. Barber bestätigt. Der Status wird automatisch sichtbar.
            </p>
          </div>

          <div style={styles.progressCircle}>
            <span>✓</span>
          </div>
        </div>

        <div style={styles.bottomNav}>
          <Link href="/" style={styles.navItemActive}>
            Home
          </Link>
          <Link href="/book" style={styles.navItem}>
            Buchen
          </Link>
          <Link href="/status" style={styles.navItem}>
            Status
          </Link>
          <Link href="/login" style={styles.navItem}>
            Login
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
    minHeight: "860px",
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
  mainActions: {
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
  },
  secondaryButton: {
    padding: "16px 20px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    textDecoration: "none",
    textAlign: "center" as const,
    fontWeight: 900,
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "16px",
  },
  tile: {
    minHeight: "132px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.10)",
    padding: "18px",
    color: "#fff",
    textDecoration: "none",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  },
  tileDark: {
    minHeight: "132px",
    borderRadius: "28px",
    background:
      "linear-gradient(145deg, rgba(212,175,55,0.26), rgba(255,255,255,0.08))",
    border: "1px solid rgba(212,175,55,0.28)",
    padding: "18px",
    color: "#fff",
    textDecoration: "none",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  },
  tileIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.10)",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
  },
  tileIconGold: {
    width: "38px",
    height: "38px",
    borderRadius: "14px",
    background: "rgba(212,175,55,0.28)",
    color: "#ffe88a",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
  },
  todayCard: {
    marginTop: "16px",
    borderRadius: "32px",
    padding: "22px",
    background: "#f5f5f7",
    color: "#111",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  smallLabel: {
    color: "#6e6e73",
    fontSize: "13px",
    fontWeight: 900,
  },
  cardTitle: {
    margin: "6px 0 0",
    fontSize: "26px",
    letterSpacing: "-0.04em",
  },
  cardText: {
    margin: "8px 0 0",
    color: "#6e6e73",
    fontSize: "14px",
    lineHeight: 1.4,
    fontWeight: 700,
  },
  progressCircle: {
    width: "62px",
    height: "62px",
    borderRadius: "50%",
    background: "#25d366",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontSize: "28px",
    fontWeight: 950,
    flex: "0 0 auto",
  },
  bottomNav: {
    position: "absolute" as const,
    left: "22px",
    right: "22px",
    bottom: "18px",
    padding: "10px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.12)",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "6px",
  },
  navItem: {
    padding: "11px 6px",
    borderRadius: "999px",
    color: "rgba(255,255,255,0.62)",
    textDecoration: "none",
    textAlign: "center" as const,
    fontSize: "12px",
    fontWeight: 900,
  },
  navItemActive: {
    padding: "11px 6px",
    borderRadius: "999px",
    background: "#fff",
    color: "#111",
    textDecoration: "none",
    textAlign: "center" as const,
    fontSize: "12px",
    fontWeight: 950,
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