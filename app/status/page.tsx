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
      <div style={styles.top}>
        <Link href="/" style={styles.back}>
          ← Zurück
        </Link>
        <Link href="/book" style={styles.back}>
          Neuen Termin anfragen
        </Link>
      </div>

      <section style={styles.card}>
        <p style={styles.badge}>Kundenstatus</p>
        <h1 style={styles.title}>Anfrage-Status</h1>
        <p style={styles.text}>
          Gib deine Telefonnummer ein, um deine gespeicherten Terminanfragen zu sehen.
        </p>

        <input
          style={styles.input}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Telefonnummer eingeben"
        />

        <div style={styles.results}>
          {!phone ? (
            <p style={styles.empty}>Bitte Telefonnummer eingeben.</p>
          ) : filtered.length === 0 ? (
            <p style={styles.empty}>Keine Anfrage gefunden.</p>
          ) : (
            filtered.map((appointment) => (
              <div key={appointment.id} style={styles.resultCard}>
                <strong>{appointment.service}</strong>
                <p>
                  {appointment.date} · {appointment.time} Uhr
                </p>
                <span>
                  Status:{" "}
                  {appointment.status === "pending"
                    ? "Offen"
                    : appointment.status === "confirmed"
                    ? "Bestätigt"
                    : "Abgelehnt"}
                </span>
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
    background: "#f5f5f7",
    padding: "32px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  top: {
    maxWidth: "760px",
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "space-between",
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
    color: "#25d366",
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
  input: {
    width: "100%",
    padding: "15px 16px",
    borderRadius: "18px",
    border: "1px solid rgba(0,0,0,0.12)",
    fontSize: "16px",
    marginTop: "24px",
  },
  results: {
    marginTop: "24px",
    display: "grid",
    gap: "12px",
  },
  empty: {
    color: "#6e6e73",
    fontWeight: 800,
  },
  resultCard: {
    background: "#f5f5f7",
    borderRadius: "22px",
    padding: "18px",
  },
};