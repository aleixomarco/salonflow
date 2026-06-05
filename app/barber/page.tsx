"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingId, setIsUpdatingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
        return;
      }

      loadAppointments();
    }

    checkLogin();
  }, [router]);

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

    const { error } = await supabase.from("appointments").delete().eq("id", id);

    setIsUpdatingId(null);

    if (error) {
      setMessage("Fehler beim Löschen: " + error.message);
      return;
    }

    await loadAppointments();
    setShowDeleteOverlay(true);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
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

  const processedAppointments = [...confirmedAppointments, ...declinedAppointments];

  return (
    <main style={styles.page}>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

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

      <section style={styles.appShell}>
        <div style={styles.statusBar}>
          <Link href="/" style={styles.statusLink}>
            ← Home
          </Link>

          <span>SalonFlow</span>
        </div>

        <div style={styles.heroCard}>
          <div style={styles.appIcon}>◆</div>

          <p style={styles.badge}>Barber-Sicht</p>

          <h1 style={styles.title}>
            Barber
            <br />
            Dashboard.
          </h1>

          <p style={styles.text}>
            Bestätige oder lehne Terminanfragen ab und kontaktiere Kunden direkt
            per WhatsApp.
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
          </div>

          {message && <div style={styles.messageBox}>{message}</div>}

          <div style={styles.headerActions}>
  <button style={styles.refreshButton} onClick={loadAppointments}>
    Neu laden
  </button>

  <Link href="/barber/settings" style={{
    flex: 1,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "999px",
    padding: "13px 14px",
    background: "rgba(255,255,255,0.10)",
    color: "#fffaf0",
    fontWeight: 950,
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "center" as const,
    fontSize: "14px",
    display: "block",
  }}>
    Einstellungen
  </Link>

  <button style={styles.logoutButton} onClick={handleLogout}>
    Ausloggen
  </button>
</div>
        </div>

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
                  <span style={styles.serviceBadge}>{appointment.service}</span>

                  <strong style={styles.appointmentTitle}>
                    {appointment.name}
                  </strong>

                  <p style={styles.appointmentText}>
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
                    {isUpdatingId === appointment.id ? "Speichert..." : "Bestätigen"}
                  </button>

                  <button
                    style={styles.decline}
                    disabled={isUpdatingId === appointment.id}
                    onClick={() => handleDecision(appointment, "declined")}
                  >
                    {isUpdatingId === appointment.id ? "Speichert..." : "Ablehnen"}
                  </button>

                  <button
                    style={styles.delete}
                    disabled={isUpdatingId === appointment.id}
                    onClick={() => deleteAppointment(appointment.id)}
                  >
                    {isUpdatingId === appointment.id ? "Löscht..." : "Löschen"}
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <section style={styles.list}>
          <h2 style={styles.sectionHeadline}>Bearbeitet</h2>

          {processedAppointments.length === 0 ? (
            <div style={styles.empty}>Noch keine bearbeiteten Anfragen.</div>
          ) : (
            processedAppointments.map((appointment) => (
              <article key={appointment.id} style={styles.appointmentCard}>
                <div>
                  <span style={styles.serviceBadge}>{appointment.service}</span>

                  <strong style={styles.appointmentTitle}>
                    {appointment.name}
                  </strong>

                  <p style={styles.appointmentText}>
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
                    {appointment.status === "confirmed" ? "Bestätigt" : "Abgelehnt"}
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
                    WhatsApp
                  </button>

                  <button
                    style={styles.delete}
                    disabled={isUpdatingId === appointment.id}
                    onClick={() => deleteAppointment(appointment.id)}
                  >
                    {isUpdatingId === appointment.id ? "Löscht..." : "Löschen"}
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
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
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#fff",
    position: "relative" as const,
    overflowX: "hidden" as const,
  },

  appShell: {
    position: "relative" as const,
    zIndex: 2,
    width: "min(430px, 100%)",
    maxHeight: "calc(100vh - 48px)",
    overflowY: "auto" as const,
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
    color: "#fffaf0",
  },

  text: {
    margin: "20px 0 0",
    color: "rgba(255,250,240,0.75)",
    fontSize: "17px",
    lineHeight: 1.45,
    fontWeight: 600,
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginTop: "22px",
  },

  statBox: {
    padding: "14px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.10)",
    display: "grid",
    gap: "6px",
    color: "#fffaf0",
  },

  messageBox: {
    marginTop: "16px",
    padding: "14px",
    borderRadius: "20px",
    background: "rgba(37,211,102,0.14)",
    color: "#86efac",
    fontWeight: 800,
    lineHeight: 1.4,
  },

  headerActions: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
  },

  refreshButton: {
    flex: 1,
    border: 0,
    borderRadius: "999px",
    padding: "13px 14px",
    background:
      "linear-gradient(135deg, #d4af37 0%, #fff1a6 50%, #b8860b 100%)",
    color: "#08080b",
    fontWeight: 950,
    cursor: "pointer",
  },

  logoutButton: {
    flex: 1,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "999px",
    padding: "13px 14px",
    background: "rgba(255,255,255,0.10)",
    color: "#fffaf0",
    fontWeight: 950,
    cursor: "pointer",
  },

  list: {
    display: "grid",
    gap: "12px",
    marginTop: "22px",
  },

  sectionHeadline: {
    fontSize: "24px",
    letterSpacing: "-0.04em",
    margin: "0 0 2px",
    color: "#fffaf0",
  },

  empty: {
    padding: "18px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.09)",
    color: "rgba(255,250,240,0.75)",
    textAlign: "center" as const,
    fontWeight: 800,
  },

  appointmentCard: {
    padding: "18px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.10)",
    display: "grid",
    gap: "14px",
    backdropFilter: "blur(20px)",
  },

  serviceBadge: {
    display: "inline-flex",
    width: "fit-content",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(212,175,55,0.16)",
    color: "#fff1a6",
    fontSize: "12px",
    fontWeight: 900,
    marginBottom: "10px",
  },

  appointmentTitle: {
    display: "block",
    fontSize: "24px",
    color: "#fffaf0",
    letterSpacing: "-0.04em",
  },

  appointmentText: {
    color: "rgba(255,250,240,0.72)",
    lineHeight: 1.5,
  },

  pendingStatus: {
    display: "inline-flex",
    width: "fit-content",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: 950,
    fontSize: "12px",
    background: "rgba(212,175,55,0.18)",
    color: "#fff1a6",
  },

  confirmedStatus: {
    display: "inline-flex",
    width: "fit-content",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: 950,
    fontSize: "12px",
    background: "rgba(37,211,102,0.18)",
    color: "#86efac",
  },

  declinedStatus: {
    display: "inline-flex",
    width: "fit-content",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: 950,
    fontSize: "12px",
    background: "rgba(239,68,68,0.18)",
    color: "#fecaca",
  },

  actions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },

  confirm: {
    border: 0,
    borderRadius: "999px",
    padding: "12px 14px",
    background: "#25d366",
    color: "#fff",
    fontWeight: 950,
    cursor: "pointer",
  },

  decline: {
    border: 0,
    borderRadius: "999px",
    padding: "12px 14px",
    background: "rgba(239,68,68,0.18)",
    color: "#fecaca",
    fontWeight: 950,
    cursor: "pointer",
  },

  whatsapp: {
    border: 0,
    borderRadius: "999px",
    padding: "12px 14px",
    background: "#fffaf0",
    color: "#08080b",
    fontWeight: 950,
    cursor: "pointer",
  },

  delete: {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "999px",
    padding: "12px 14px",
    background: "rgba(255,255,255,0.10)",
    color: "rgba(255,250,240,0.78)",
    fontWeight: 950,
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
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "34px",
    padding: "34px",
    textAlign: "center" as const,
    boxShadow: "0 30px 100px rgba(0,0,0,0.35)",
    animation: "overlayIn 0.35s ease forwards",
  },

  overlayIcon: {
    width: "74px",
    height: "74px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, #d4af37 0%, #fff1a6 55%, #b8860b 100%)",
    color: "#08080b",
    display: "grid",
    placeItems: "center",
    margin: "0 auto 18px",
    fontSize: "38px",
    fontWeight: 950,
  },

  overlayTitle: {
    margin: "0 0 24px",
    fontSize: "30px",
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
    color: "#fffaf0",
  },

  overlayButton: {
    border: 0,
    borderRadius: "999px",
    padding: "15px 28px",
    background:
      "linear-gradient(135deg, #d4af37 0%, #fff1a6 50%, #b8860b 100%)",
    color: "#08080b",
    fontWeight: 950,
    fontSize: "16px",
    cursor: "pointer",
    animation: "buttonPulse 1.8s ease-in-out infinite",
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