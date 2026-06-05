"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Appointment = {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "declined";
};

export default function StatusPage() {
  const [phone, setPhone] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem("salonflow_appointments") || "[]"
    );

    setAppointments(data);
  }, []);

  const filtered = appointments.filter((appointment) =>
    appointment.phone.includes(phone)
  );

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
          <div style={styles.appIcon}>●</div>

          <p style={styles.badge}>Kundenstatus</p>

          <h1 style={styles.title}>
            Anfrage
            <br />
            verfolgen.
          </h1>

          <p style={styles.text}>
            Gib deine Telefonnummer ein und prüfe jederzeit den Status deiner
            Anfrage.
          </p>
        </div>

        <div style={styles.searchCard}>
          <input
            style={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Telefonnummer eingeben"
          />
        </div>

        <div style={styles.results}>
          {!phone ? (
            <div style={styles.emptyCard}>Bitte Telefonnummer eingeben.</div>
          ) : filtered.length === 0 ? (
            <div style={styles.emptyCard}>Keine Anfrage gefunden.</div>
          ) : (
            filtered.map((appointment) => (
              <div key={appointment.id} style={styles.resultCard}>
                <span style={styles.serviceBadge}>{appointment.service}</span>

                <h3 style={styles.cardTitle}>
                  {appointment.date} · {appointment.time} Uhr
                </h3>

                <div
                  style={{
                    ...styles.statusPill,
                    background:
                      appointment.status === "confirmed"
                        ? "rgba(37,211,102,0.18)"
                        : appointment.status === "declined"
                        ? "rgba(239,68,68,0.18)"
                        : "rgba(212,175,55,0.18)",
                    color:
                      appointment.status === "confirmed"
                        ? "#86efac"
                        : appointment.status === "declined"
                        ? "#fecaca"
                        : "#fff1a6",
                  }}
                >
                  {appointment.status === "pending"
                    ? "Offen"
                    : appointment.status === "confirmed"
                    ? "Bestätigt"
                    : "Abgelehnt"}
                </div>
              </div>
            ))
          )}
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
  searchCard: {
    marginTop: "16px",
    padding: "18px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  input: {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "18px",
    padding: "14px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
  },
  results: {
    display: "grid",
    gap: "12px",
    marginTop: "16px",
  },
  emptyCard: {
    padding: "18px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.09)",
    color: "rgba(255,255,255,0.62)",
    fontWeight: 800,
    textAlign: "center" as const,
  },
  resultCard: {
    padding: "18px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  serviceBadge: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(212,175,55,0.16)",
    color: "#fff1a6",
    fontSize: "12px",
    fontWeight: 900,
  },
  cardTitle: {
    margin: "12px 0",
    fontSize: "20px",
    color: "#fff",
  },
  statusPill: {
    display: "inline-flex",
    padding: "10px 14px",
    borderRadius: "999px",
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