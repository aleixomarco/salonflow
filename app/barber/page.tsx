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

export default function BarberPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  function loadAppointments() {
    const data = JSON.parse(
      localStorage.getItem("salonflow_appointments") || "[]"
    );

    setAppointments(data);
  }

  function updateStatus(id: number, status: Appointment["status"]) {
    const updated = appointments.map((appointment) =>
      appointment.id === id ? { ...appointment, status } : appointment
    );

    setAppointments(updated);
    localStorage.setItem("salonflow_appointments", JSON.stringify(updated));
  }

  function deleteAppointment(id: number) {
    const updated = appointments.filter((appointment) => appointment.id !== id);

    setAppointments(updated);
    localStorage.setItem("salonflow_appointments", JSON.stringify(updated));
  }

  function openWhatsApp(appointment: Appointment) {
    const phone = appointment.phone.replace(/\D/g, "");

    const text = encodeURIComponent(
      `Hallo ${appointment.name}, dein Termin für ${appointment.service} am ${appointment.date} um ${appointment.time} Uhr ist bestätigt.`
    );

    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  }

  return (
    <main style={styles.page}>
      <div style={styles.top}>
        <Link href="/" style={styles.back}>
          ← Zurück
        </Link>
        <Link href="/book" style={styles.back}>
          Kundensicht öffnen
        </Link>
      </div>

      <section style={styles.headerCard}>
        <p style={styles.badge}>Barber-Sicht</p>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.text}>
          Hier sieht der Barber offene Anfragen und kann Termine bestätigen,
          ablehnen oder den Kunden per WhatsApp kontaktieren.
        </p>
      </section>

      <section style={styles.list}>
        {appointments.length === 0 ? (
          <div style={styles.empty}>Noch keine Terminanfragen vorhanden.</div>
        ) : (
          appointments.map((appointment) => (
            <article key={appointment.id} style={styles.appointmentCard}>
              <div>
                <strong style={styles.appointmentTitle}>
                  {appointment.name}
                </strong>

                <p style={styles.appointmentText}>
                  {appointment.service}
                  <br />
                  {appointment.date} · {appointment.time} Uhr
                  <br />
                  Telefon: {appointment.phone}
                </p>

                <span
                  style={{
                    ...styles.status,
                    background:
                      appointment.status === "confirmed"
                        ? "#dcfce7"
                        : appointment.status === "declined"
                        ? "#fee2e2"
                        : "#fef3c7",
                    color:
                      appointment.status === "confirmed"
                        ? "#166534"
                        : appointment.status === "declined"
                        ? "#991b1b"
                        : "#92400e",
                  }}
                >
                  {appointment.status === "pending"
                    ? "Offen"
                    : appointment.status === "confirmed"
                    ? "Bestätigt"
                    : "Abgelehnt"}
                </span>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.confirm}
                  onClick={() => updateStatus(appointment.id, "confirmed")}
                >
                  Bestätigen
                </button>

                <button
                  style={styles.decline}
                  onClick={() => updateStatus(appointment.id, "declined")}
                >
                  Ablehnen
                </button>

                <button
                  style={styles.whatsapp}
                  onClick={() => openWhatsApp(appointment)}
                >
                  WhatsApp
                </button>

                <button
                  style={styles.delete}
                  onClick={() => deleteAppointment(appointment.id)}
                >
                  Löschen
                </button>
              </div>
            </article>
          ))
        )}
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
    maxWidth: "960px",
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "space-between",
  },
  back: {
    color: "#0071e3",
    textDecoration: "none",
    fontWeight: 700,
  },
  headerCard: {
    maxWidth: "960px",
    margin: "0 auto 20px",
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
  list: {
    maxWidth: "960px",
    margin: "0 auto",
    display: "grid",
    gap: "14px",
  },
  empty: {
    background: "#fff",
    borderRadius: "24px",
    padding: "24px",
    color: "#6e6e73",
    textAlign: "center" as const,
    fontWeight: 800,
  },
  appointmentCard: {
    background: "#fff",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "20px",
  },
  appointmentTitle: {
    fontSize: "22px",
  },
  appointmentText: {
    color: "#6e6e73",
    lineHeight: 1.5,
  },
  status: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: 900,
    fontSize: "13px",
  },
  actions: {
    display: "grid",
    gap: "8px",
    minWidth: "140px",
  },
  confirm: {
    border: 0,
    borderRadius: "999px",
    padding: "12px 14px",
    background: "#25d366",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  decline: {
    border: 0,
    borderRadius: "999px",
    padding: "12px 14px",
    background: "#fee2e2",
    color: "#991b1b",
    fontWeight: 900,
    cursor: "pointer",
  },
  whatsapp: {
    border: 0,
    borderRadius: "999px",
    padding: "12px 14px",
    background: "#111",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  delete: {
    border: 0,
    borderRadius: "999px",
    padding: "12px 14px",
    background: "#f5f5f7",
    color: "#6e6e73",
    fontWeight: 900,
    cursor: "pointer",
  },
};