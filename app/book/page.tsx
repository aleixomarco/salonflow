"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const services = ["Haarschnitt Herren", "Haarschnitt Kinder"];

type AppointmentFromSupabase = {
  id: number;
  customer_name: string;
  customer_phone: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: "pending" | "confirmed" | "declined" | "cancelled";
  created_at?: string;
};

function createTimeOptions(startHour: number, endHour: number) {
  const options: string[] = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === endHour && minute > 0) continue;

      const h = String(hour).padStart(2, "0");
      const m = String(minute).padStart(2, "0");

      options.push(`${h}:${m}`);
    }
  }

  return options;
}

function getOpeningTimes(dateString: string) {
  if (!dateString) return [];

  const selectedDate = new Date(dateString + "T00:00:00");
  const day = selectedDate.getDay();

  if (day === 0) return [];

  if (day >= 1 && day <= 5) {
    return createTimeOptions(9, 18);
  }

  if (day === 6) {
    return createTimeOptions(10, 16);
  }

  return [];
}

function formatDate(dateString: string) {
  if (!dateString) return "";

  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function BookPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [bookedAppointments, setBookedAppointments] = useState<
    AppointmentFromSupabase[]
  >([]);

  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allTimes = getOpeningTimes(date);

  const availableTimes = allTimes.filter((slot) => {
    return !bookedAppointments.some((appointment) => {
      const isSameDate = appointment.appointment_date === date;
      const isSameTime = appointment.appointment_time === slot;

      const blocksSlot =
        appointment.status === "pending" ||
        appointment.status === "confirmed";

      return isSameDate && isSameTime && blocksSlot;
    });
  });

  useEffect(() => {
    async function loadBookedAppointments() {
      if (!date) {
        setBookedAppointments([]);
        return;
      }

      setIsLoadingTimes(true);

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("appointment_date", date)
        .in("status", ["pending", "confirmed"]);

      if (error) {
        alert("Fehler beim Laden der freien Zeiten: " + error.message);
        setBookedAppointments([]);
        setIsLoadingTimes(false);
        return;
      }

      setBookedAppointments((data || []) as AppointmentFromSupabase[]);
      setIsLoadingTimes(false);
    }

    loadBookedAppointments();
  }, [date]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name || !phone || !service || !date || !time) {
      alert("Bitte fülle alle Felder aus.");
      return;
    }

    const stillAvailable = availableTimes.includes(time);

    if (!stillAvailable) {
      alert("Diese Uhrzeit ist leider nicht mehr frei. Bitte wähle eine andere Uhrzeit.");
      setTime("");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("appointments").insert({
      customer_name: name,
      customer_phone: phone,
      service,
      appointment_date: date,
      appointment_time: time,
      status: "pending",
    });

    setIsSubmitting(false);

    if (error) {
      alert("Fehler beim Speichern: " + error.message);
      return;
    }

    setName("");
    setPhone("");
    setService("");
    setDate("");
    setTime("");
    setBookedAppointments([]);

    router.push("/success");
  }

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
          <div style={styles.appIcon}>✂︎</div>

          <p style={styles.badge}>Buchung</p>

          <h1 style={styles.title}>
            Termin
            <br />
            anfragen.
          </h1>

          <p style={styles.text}>
            Wähle den Service, Datum und freie Uhrzeit. Dein Termin ist erst bestätigt,
            wenn der Barber ihn annimmt. 
            <br />
            Du kannst den Status deiner Anfrage jederzeit in der App verfolgen.
          </p>
        </div>

        <div style={styles.infoBox}>
          <strong>Öffnungszeiten</strong>
          <p>
            Mo–Fr: 09:00–18:00 Uhr
            <br />
            Sa: 10:00–16:00 Uhr
            <br />
            So: geschlossen
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Name
            <input
              style={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="Dein Name"
            />
          </label>

          <label style={styles.label}>
            Telefon
            <input
              style={styles.input}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              placeholder="+49 176 12345678"
            />
          </label>

          <label style={styles.label}>
            Leistung
            <select
              style={styles.input}
              value={service}
              onChange={(event) => setService(event.target.value)}
              required
            >
              <option value="">Bitte auswählen</option>

              {services.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Datum
            <input
              style={styles.input}
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(event) => {
                setDate(event.target.value);
                setTime("");
              }}
              required
            />
          </label>

          <label style={styles.label}>
            Uhrzeit
            <select
              style={styles.input}
              value={time}
              onChange={(event) => setTime(event.target.value)}
              required
              disabled={!date || availableTimes.length === 0 || isLoadingTimes}
            >
              <option value="">
                {!date
                  ? "Bitte zuerst Datum wählen"
                  : isLoadingTimes
                  ? "Freie Zeiten werden geladen..."
                  : allTimes.length === 0
                  ? "An diesem Tag geschlossen"
                  : availableTimes.length === 0
                  ? "Keine freien Termine"
                  : "Bitte Uhrzeit wählen"}
              </option>

              {availableTimes.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>

          {date && (
            <div style={styles.slotInfo}>
              <strong>{formatDate(date)}</strong>

              <span>
                {isLoadingTimes
                  ? "Freie Zeiten werden geprüft..."
                  : allTimes.length === 0
                  ? "Der Salon ist an diesem Tag geschlossen."
                  : `${availableTimes.length} freie Uhrzeiten verfügbar.`}
              </span>
            </div>
          )}

          <button
            style={{
              ...styles.button,
              opacity: isSubmitting ? 0.65 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Anfrage wird gespeichert..." : "Anfrage senden"}
          </button>
        </form>
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

  infoBox: {
    marginTop: "16px",
    padding: "18px",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "#fffaf0",
    lineHeight: 1.5,
  },

  form: {
    display: "grid",
    gap: "14px",
    marginTop: "16px",
    padding: "18px",
    borderRadius: "32px",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(20px)",
  },

  label: {
    display: "grid",
    gap: "8px",
    color: "rgba(255,250,240,0.85)",
    fontSize: "13px",
    fontWeight: 900,
  },

  input: {
    width: "100%",
    padding: "15px 16px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "#fffaf0",
    fontSize: "15px",
    outline: "none",
  },

  slotInfo: {
    display: "grid",
    gap: "6px",
    padding: "16px",
    borderRadius: "22px",
    background: "rgba(212,175,55,0.16)",
    color: "#fff1a6",
    lineHeight: 1.5,
    fontWeight: 800,
  },

  button: {
    padding: "16px 22px",
    borderRadius: "999px",
    border: 0,
    background:
      "linear-gradient(135deg, #d4af37 0%, #fff1a6 50%, #b8860b 100%)",
    color: "#08080b",
    fontWeight: 950,
    fontSize: "16px",
    boxShadow: "0 18px 50px rgba(212,175,55,0.25)",
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