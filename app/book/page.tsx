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

  // 0 = Sonntag
  if (day === 0) return [];

  // Montag bis Freitag: 09:00–18:00
  if (day >= 1 && day <= 5) {
    return createTimeOptions(9, 18);
  }

  // Samstag: 10:00–16:00
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
      <div style={styles.top}>
        <Link href="/" style={styles.back}>
          ← Zurück
        </Link>

        <Link href="/status" style={styles.back}>
          Status ansehen
        </Link>
      </div>

      <section style={styles.card}>
        <p style={styles.badge}>Kundensicht</p>

        <h1 style={styles.title}>Termin anfragen</h1>

        <p style={styles.text}>
          Wähle Leistung, Datum und freie Uhrzeit. Der Termin ist erst bestätigt,
          wenn der Barber ihn akzeptiert.
        </p>

        <div style={styles.infoBox}>
          <strong>Öffnungszeiten:</strong>
          <br />
          Montag bis Freitag: 09:00–18:00 Uhr
          <br />
          Samstag: 10:00–16:00 Uhr
          <br />
          Sonntag: geschlossen
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
              <br />
              {isLoadingTimes
                ? "Freie Zeiten werden geprüft..."
                : allTimes.length === 0
                ? "Der Salon ist an diesem Tag geschlossen."
                : `${availableTimes.length} freie Uhrzeiten verfügbar.`}
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
    background: "#f5f5f7",
    padding: "32px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  top: {
    maxWidth: "760px",
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
  infoBox: {
    marginTop: "22px",
    padding: "18px",
    borderRadius: "22px",
    background: "#f5f5f7",
    color: "#1d1d1f",
    lineHeight: 1.6,
  },
  form: {
    display: "grid",
    gap: "18px",
    marginTop: "28px",
  },
  label: {
    display: "grid",
    gap: "8px",
    fontWeight: 800,
  },
  input: {
    padding: "15px 16px",
    borderRadius: "18px",
    border: "1px solid rgba(0,0,0,0.12)",
    fontSize: "16px",
    background: "#fff",
  },
  slotInfo: {
    padding: "16px",
    borderRadius: "20px",
    background: "rgba(37, 211, 102, 0.10)",
    color: "#0c5f2a",
    lineHeight: 1.5,
  },
  button: {
    padding: "16px 22px",
    borderRadius: "999px",
    border: 0,
    background: "#25d366",
    color: "#fff",
    fontWeight: 900,
    fontSize: "16px",
  },
};