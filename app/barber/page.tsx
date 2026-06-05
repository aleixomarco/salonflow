"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type AppointmentStatus = "pending" | "confirmed" | "declined" | "cancelled";

type Appointment = {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
};

type AppointmentFromSupabase = {
  id: number;
  customer_name: string;
  customer_phone: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  created_at?: string;
};

export default function BarberPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingId, setIsUpdatingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    setIsLoading(false);

    if (error) {
      setMessage("Fehler beim Laden: " + error.message);
      return;
    }

    const mapped = ((data || []) as AppointmentFromSupabase[]).map((item) => ({
      id: item.id,
      name: item.customer_name,
      phone: item.customer_phone,
      service: item.service,
      date: item.appointment_date,
      time: item.appointment_time,
      status: item.status,
    }));

    setAppointments(mapped);
  }

  async function handleDecision(
    appointment: Appointment,
    newStatus: "confirmed" | "declined"
  ) {
    setIsUpdatingId(appointment.id);
    setMessage("");

    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appointment.id);

    setIsUpdatingId(null);

    if (error) {
      setMessage("Fehler beim Aktualisieren: " + error.message);
      return;
    }

    await loadAppointments();

    if (newStatus === "confirmed") {
      setMessage("Termin wurde bestätigt. WhatsApp-Nachricht wird vorbereitet.");
      openWhatsAppConfirmation(appointment);
    }

    if (newStatus === "declined") {
      setMessage("Termin wurde abgelehnt. WhatsApp-Nachricht wird vorbereitet.");
      openWhatsAppDecline(appointment);
    }
  }

  async function deleteAppointment(id: number) {
    setIsUpdatingId(id);
    setMessage("");

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);

    setIsUpdatingId(null);

    if (error) {
      setMessage("Fehler beim Löschen: " + error.message);
      return;
    }

    await loadAppointments();
    setShowDeleteOverlay(true);
  }

  function cleanPhoneNumber(phone: string) {
    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0")) {
      cleaned = "49" + cleaned.slice(1);
    }

    return cleaned;
  }

  function openWhatsAppConfirmation(appointment: Appointment) {
    const phone = cleanPhoneNumber(appointment.phone);

    const text = encodeURIComponent(
      `Hallo ${appointment.name}, dein Termin wurde bestätigt ✅

Leistung: ${appointment.service}
Datum: ${formatDate(appointment.date)}
Uhrzeit: ${appointment.time} Uhr

Wir freuen uns auf dich!`
    );

    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  }

  function openWhatsAppDecline(appointment: Appointment) {
    const phone = cleanPhoneNumber(appointment.phone);

    const text = encodeURIComponent(
      `Hallo ${appointment.name}, leider können wir deinen gewünschten Termin nicht bestätigen.

Leistung: ${appointment.service}
Datum: ${formatDate(appointment.date)}
Uhrzeit: ${appointment.time} Uhr

Bitte schreib uns kurz, damit wir gemeinsam eine passende Alternative finden.`
    );

    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  );

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  );

  const declinedAppointments = appointments.filter(
    (appointment) => appointment.status === "declined"
  );

  return (
    <main style={styles.page}>
      {showDeleteOverlay && (
        <div style={styles.overlay}>
          <div style={styles.overlayCard}>
            <div style={styles.overlayIcon}>✓</div>

            <h2 style={styles.overlayTitle}>Anfrage erfolgreich gelöscht.</h2>

            <button
              style={styles.overlayButton}
              onClick={() => setShowDeleteOverlay(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}

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
          Bestätige oder lehne Terminanfragen ab. Danach verschwindet die Anfrage
          aus den offenen Anfragen und der Kunde kann den Status sehen.
        </p>

        <div style={styles.stats}>
          <div style={styles.statBox}>
            <span>Offen</span>
            <strong>{pendingAppointments.length}</strong>
          </div>

          <div style={styles.statBox}>
            <span>Bestätigt</span>
            <strong>{confirmedAppointments.length}</strong>
          </div>

          <div style={styles.statBox}>
            <span>Abgelehnt</span>
            <strong>{declinedAppointments.length}</strong>
          </div>

          <div style={styles.statBox}>
            <span>Gesamt</span>
            <strong>{appointments.length}</strong>
          </div>
        </div>

        {message && <div style={styles.messageBox}>{message}</div>}

        <button style={styles.refreshButton} onClick={loadAppointments}>
          Neu laden
        </button>
      </section>

      <section style={styles.list}>
        <h2 style={styles.sectionHeadline}>Offene Anfragen</h2>

        {isLoading ? (
          <div style={styles.empty}>Termine werden geladen...</div>
        ) : pendingAppointments.length === 0 ? (
          <div style={styles.empty}>Keine offenen Terminanfragen.</div>
        ) : (
          pendingAppointments.map((appointment) => (
            <article key={appointment.id} style={styles.appointmentCard}>
              <div>
                <strong style={styles.appointmentTitle}>
                  {appointment.name}
                </strong>

                <p style={styles.appointmentText}>
                  {appointment.service}
                  <br />
                  {formatDate(appointment.date)} · {appointment.time} Uhr
                  <br />
                  Telefon: {appointment.phone}
                </p>

                <span style={styles.pendingStatus}>Offen</span>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.confirm}
                  disabled={isUpdatingId === appointment.id}
                  onClick={() => handleDecision(appointment, "confirmed")}
                >
                  {isUpdatingId === appointment.id
                    ? "Speichert..."
                    : "Bestätigen"}
                </button>

                <button
                  style={styles.decline}
                  disabled={isUpdatingId === appointment.id}
                  onClick={() => handleDecision(appointment, "declined")}
                >
                  {isUpdatingId === appointment.id
                    ? "Speichert..."
                    : "Ablehnen"}
                </button>

                <button
                  style={styles.delete}
                  disabled={isUpdatingId === appointment.id}
                  onClick={() => deleteAppointment(appointment.id)}
                >
                  {isUpdatingId === appointment.id
                    ? "Löscht..."
                    : "Löschen"}
                </button>
              </div>
            </article>
          ))
        )}
      </section>

      <section style={styles.list}>
        <h2 style={styles.sectionHeadline}>Bearbeitete Anfragen</h2>

        {[...confirmedAppointments, ...declinedAppointments].length === 0 ? (
          <div style={styles.empty}>Noch keine bearbeiteten Anfragen.</div>
        ) : (
          [...confirmedAppointments, ...declinedAppointments].map(
            (appointment) => (
              <article key={appointment.id} style={styles.appointmentCard}>
                <div>
                  <strong style={styles.appointmentTitle}>
                    {appointment.name}
                  </strong>

                  <p style={styles.appointmentText}>
                    {appointment.service}
                    <br />
                    {formatDate(appointment.date)} · {appointment.time} Uhr
                    <br />
                    Telefon: {appointment.phone}
                  </p>

                  <span
                    style={
                      appointment.status === "confirmed"
                        ? styles.confirmedStatus
                        : styles.declinedStatus
                    }
                  >
                    {appointment.status === "confirmed"
                      ? "Bestätigt"
                      : "Abgelehnt"}
                  </span>
                </div>

                <div style={styles.actions}>
                  <button
                    style={styles.whatsapp}
                    onClick={() =>
                      appointment.status === "confirmed"
                        ? openWhatsAppConfirmation(appointment)
                        : openWhatsAppDecline(appointment)
                    }
                  >
                    WhatsApp erneut
                  </button>

                  <button
                    style={styles.delete}
                    disabled={isUpdatingId === appointment.id}
                    onClick={() => deleteAppointment(appointment.id)}
                  >
                    {isUpdatingId === appointment.id
                      ? "Löscht..."
                      : "Löschen"}
                  </button>
                </div>
              </article>
            )
          )
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
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  top: {
    maxWidth: "980px",
    margin: "0 auto 20px",
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
  },
  back: {
    color: "#0071e3",
    textDecoration: "none",
    fontWeight: 700,
  },
  headerCard: {
    maxWidth: "980px",
    margin: "0 auto 20px",
    background: "#fff",
    borderRadius: "34px",
    padding: "34px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.08)",
  },
  badge: {
    color: "#0071e3",
    fontWeight: 900,
    margin: 0,
  },
  title: {
    fontSize: "52px",
    letterSpacing: "-0.06em",
    margin: "10px 0 12px",
    lineHeight: 1,
  },
  text: {
    color: "#6e6e73",
    fontSize: "18px",
    lineHeight: 1.5,
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginTop: "26px",
  },
  statBox: {
    background: "#f5f5f7",
    borderRadius: "22px",
    padding: "18px",
  },
  messageBox: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "20px",
    background: "rgba(37, 211, 102, 0.12)",
    color: "#0c5f2a",
    fontWeight: 800,
  },
  refreshButton: {
    marginTop: "20px",
    border: 0,
    borderRadius: "999px",
    padding: "13px 18px",
    background: "#111",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  list: {
    maxWidth: "980px",
    margin: "28px auto 0",
    display: "grid",
    gap: "14px",
  },
  sectionHeadline: {
    fontSize: "28px",
    letterSpacing: "-0.04em",
    margin: "0 0 4px",
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
  pendingStatus: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: 900,
    fontSize: "13px",
    background: "#fef3c7",
    color: "#92400e",
  },
  confirmedStatus: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: 900,
    fontSize: "13px",
    background: "#dcfce7",
    color: "#166534",
  },
  declinedStatus: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: 900,
    fontSize: "13px",
    background: "#fee2e2",
    color: "#991b1b",
  },
  actions: {
    display: "grid",
    gap: "8px",
    minWidth: "150px",
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
  overlay: {
    position: "fixed" as const,
    inset: 0,
    zIndex: 9999,
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  overlayCard: {
    width: "min(420px, 100%)",
    background: "#fff",
    borderRadius: "34px",
    padding: "34px",
    textAlign: "center" as const,
    boxShadow: "0 30px 100px rgba(0,0,0,0.22)",
    animation: "overlayIn 0.35s ease forwards",
  },
  overlayIcon: {
    width: "74px",
    height: "74px",
    borderRadius: "50%",
    background: "#25d366",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    margin: "0 auto 18px",
    fontSize: "38px",
    fontWeight: 900,
    boxShadow: "0 18px 50px rgba(37,211,102,0.35)",
  },
  overlayTitle: {
    margin: "0 0 24px",
    fontSize: "30px",
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
  },
  overlayButton: {
    border: 0,
    borderRadius: "999px",
    padding: "15px 28px",
    background: "#111",
    color: "#fff",
    fontWeight: 900,
    fontSize: "16px",
    cursor: "pointer",
    animation: "buttonPulse 1.8s ease-in-out infinite",
  },
};