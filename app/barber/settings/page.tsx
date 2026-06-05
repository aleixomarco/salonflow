"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const DAYS = [
  { key: "monday",    label: "Montag" },
  { key: "tuesday",   label: "Dienstag" },
  { key: "wednesday", label: "Mittwoch" },
  { key: "thursday",  label: "Donnerstag" },
  { key: "friday",    label: "Freitag" },
  { key: "saturday",  label: "Samstag" },
  { key: "sunday",    label: "Sonntag" },
];

const DEFAULT_HOURS = {
  monday:    { open: true,  from: "09:00", to: "18:00" },
  tuesday:   { open: true,  from: "09:00", to: "18:00" },
  wednesday: { open: true,  from: "09:00", to: "18:00" },
  thursday:  { open: true,  from: "09:00", to: "18:00" },
  friday:    { open: true,  from: "09:00", to: "18:00" },
  saturday:  { open: true,  from: "10:00", to: "16:00" },
  sunday:    { open: false, from: "09:00", to: "18:00" },
};

type DayKey = keyof typeof DEFAULT_HOURS;

type WorkingHours = {
  [key in DayKey]: { open: boolean; from: string; to: string };
};

type BlockedSlot = {
  id: string;
  type: "day" | "hour";
  date: string;
  from?: string;
  to?: string;
};

export default function BarberSettingsPage() {
  const router = useRouter();

  const [slotDuration, setSlotDuration] = useState<10 | 15 | 20>(15);
  const [workingHours, setWorkingHours] = useState<WorkingHours>(DEFAULT_HOURS);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);

  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockType, setNewBlockType] = useState<"day" | "hour">("day");
  const [newBlockFrom, setNewBlockFrom] = useState("12:00");
  const [newBlockTo, setNewBlockTo] = useState("14:00");

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("salon_settings")
        .select("*")
        .eq("user_id", sessionData.session.user.id)
        .single();

      if (data) {
        setSlotDuration(data.slot_duration ?? 15);
        setWorkingHours(data.working_hours ?? DEFAULT_HOURS);
        setBlockedSlots(data.blocked_slots ?? []);
      }

      setIsLoading(false);
    }

    load();
  }, [router]);

  function updateDay(day: DayKey, field: "open" | "from" | "to", value: string | boolean) {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  function addBlockedSlot() {
    if (!newBlockDate) return;

    const newSlot: BlockedSlot = {
      id: crypto.randomUUID(),
      type: newBlockType,
      date: newBlockDate,
      ...(newBlockType === "hour" ? { from: newBlockFrom, to: newBlockTo } : {}),
    };

    setBlockedSlots((prev) => [...prev, newSlot]);
    setNewBlockDate("");
    setNewBlockType("day");
    setNewBlockFrom("12:00");
    setNewBlockTo("14:00");
  }

  function removeBlockedSlot(id: string) {
    setBlockedSlots((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage("");

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;

    const userId = sessionData.session.user.id;

    const { error } = await supabase
      .from("salon_settings")
      .upsert({
        user_id: userId,
        slot_duration: slotDuration,
        working_hours: workingHours,
        blocked_slots: blockedSlots,
      }, { onConflict: "user_id" });

    setIsSaving(false);

    if (error) {
      setMessage("Fehler beim Speichern: " + error.message);
    } else {
      setMessage("Einstellungen gespeichert ✓");
    }
  }

  if (isLoading) {
    return (
      <main style={styles.page}>
        <div style={styles.glowOne}></div>
        <div style={styles.glowTwo}></div>
        <section style={styles.appShell}>
          <div style={styles.empty}>Einstellungen werden geladen...</div>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <section style={styles.appShell}>
        <div style={styles.statusBar}>
          <Link href="/barber" style={styles.statusLink}>
            ← Dashboard
          </Link>
          <span>SalonFlow</span>
        </div>

        <div style={styles.heroCard}>
          <div style={styles.appIcon}>⚙︎</div>
          <p style={styles.badge}>Barber-Einstellungen</p>
          <h1 style={styles.title}>
            Dein
            <br />
            Kalender.
          </h1>
          <p style={styles.text}>
            Lege deinen Buchungsrhythmus und deine Arbeitszeiten fest.
          </p>
        </div>

        {/* Slot-Dauer */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Minuten pro Slot</h2>
          <div style={styles.slotGrid}>
            {([10, 15, 20] as const).map((val) => (
              <button
                key={val}
                style={{
                  ...styles.slotButton,
                  ...(slotDuration === val ? styles.slotButtonActive : {}),
                }}
                onClick={() => setSlotDuration(val)}
              >
                {val} min
              </button>
            ))}
          </div>
        </div>

        {/* Arbeitszeiten */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Arbeitszeiten</h2>
          <div style={styles.dayGrid}>
            {DAYS.map(({ key, label }) => {
              const day = workingHours[key as DayKey];
              return (
                <div key={key} style={styles.dayRow}>
                  <div style={styles.dayLeft}>
                    <button
                      style={{
                        ...styles.toggleButton,
                        ...(day.open ? styles.toggleOn : styles.toggleOff),
                      }}
                      onClick={() => updateDay(key as DayKey, "open", !day.open)}
                    >
                      {day.open ? "Offen" : "Zu"}
                    </button>
                    <span style={styles.dayLabel}>{label}</span>
                  </div>

                  {day.open && (
                    <div style={styles.dayRight}>
                      <input
                        type="time"
                        style={styles.timeInput}
                        value={day.from}
                        onChange={(e) => updateDay(key as DayKey, "from", e.target.value)}
                      />
                      <span style={styles.timeSep}>–</span>
                      <input
                        type="time"
                        style={styles.timeInput}
                        value={day.to}
                        onChange={(e) => updateDay(key as DayKey, "to", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Geblockte Tage / Stunden */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Geblockte Zeiten</h2>

          <div style={styles.blockForm}>
            <div style={styles.blockTypeRow}>
              <button
                style={{
                  ...styles.slotButton,
                  ...(newBlockType === "day" ? styles.slotButtonActive : {}),
                }}
                onClick={() => setNewBlockType("day")}
              >
                Ganzer Tag
              </button>
              <button
                style={{
                  ...styles.slotButton,
                  ...(newBlockType === "hour" ? styles.slotButtonActive : {}),
                }}
                onClick={() => setNewBlockType("hour")}
              >
                Stunden
              </button>
            </div>

            <input
              type="date"
              style={styles.input}
              value={newBlockDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setNewBlockDate(e.target.value)}
            />

            {newBlockType === "hour" && (
              <div style={styles.dayRight}>
                <input
                  type="time"
                  style={styles.timeInput}
                  value={newBlockFrom}
                  onChange={(e) => setNewBlockFrom(e.target.value)}
                />
                <span style={styles.timeSep}>–</span>
                <input
                  type="time"
                  style={styles.timeInput}
                  value={newBlockTo}
                  onChange={(e) => setNewBlockTo(e.target.value)}
                />
              </div>
            )}

            <button style={styles.addButton} onClick={addBlockedSlot}>
              + Blockierung hinzufügen
            </button>
          </div>

          {blockedSlots.length > 0 && (
            <div style={styles.blockedList}>
              {blockedSlots.map((slot) => (
                <div key={slot.id} style={styles.blockedItem}>
                  <div>
                    <strong style={styles.blockedDate}>
                      {new Date(slot.date + "T00:00:00").toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </strong>
                    <span style={styles.blockedType}>
                      {slot.type === "day"
                        ? " · Ganzer Tag"
                        : ` · ${slot.from} – ${slot.to} Uhr`}
                    </span>
                  </div>
                  <button
                    style={styles.removeButton}
                    onClick={() => removeBlockedSlot(slot.id)}
                  >
                    Entfernen
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Speichern */}
        {message && (
          <div style={{
            ...styles.messageBox,
            background: message.includes("Fehler")
              ? "rgba(239,68,68,0.16)"
              : "rgba(37,211,102,0.14)",
            color: message.includes("Fehler") ? "#fecaca" : "#86efac",
          }}>
            {message}
          </div>
        )}

        <button
          style={{
            ...styles.saveButton,
            opacity: isSaving ? 0.65 : 1,
            cursor: isSaving ? "not-allowed" : "pointer",
          }}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Wird gespeichert..." : "Einstellungen speichern"}
        </button>
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
    marginBottom: "16px",
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
  section: {
    marginTop: "16px",
    padding: "20px",
    borderRadius: "32px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  sectionTitle: {
    margin: "0 0 14px",
    fontSize: "20px",
    letterSpacing: "-0.03em",
    color: "#fffaf0",
  },
  slotGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
  },
  slotButton: {
    padding: "12px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,250,240,0.72)",
    fontWeight: 900,
    fontSize: "14px",
    cursor: "pointer",
  },
  slotButtonActive: {
    background: "linear-gradient(135deg, #d4af37 0%, #fff1a6 50%, #b8860b 100%)",
    color: "#08080b",
    border: "0",
  },
  dayGrid: {
    display: "grid",
    gap: "10px",
  },
  dayRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    padding: "12px 14px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  dayLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  dayLabel: {
    fontSize: "14px",
    fontWeight: 800,
    color: "#fffaf0",
  },
  dayRight: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  toggleButton: {
    padding: "6px 12px",
    borderRadius: "999px",
    border: 0,
    fontWeight: 900,
    fontSize: "12px",
    cursor: "pointer",
  },
  toggleOn: {
    background: "rgba(37,211,102,0.20)",
    color: "#86efac",
  },
  toggleOff: {
    background: "rgba(255,255,255,0.10)",
    color: "rgba(255,250,240,0.45)",
  },
  timeInput: {
    padding: "8px 10px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "#fffaf0",
    fontSize: "13px",
    fontWeight: 800,
    width: "88px",
  },
  timeSep: {
    color: "rgba(255,250,240,0.45)",
    fontWeight: 900,
  },
  blockForm: {
    display: "grid",
    gap: "10px",
  },
  blockTypeRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "#fffaf0",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  addButton: {
    padding: "13px",
    borderRadius: "999px",
    border: "1px solid rgba(212,175,55,0.30)",
    background: "rgba(212,175,55,0.12)",
    color: "#fff1a6",
    fontWeight: 950,
    fontSize: "14px",
    cursor: "pointer",
  },
  blockedList: {
    display: "grid",
    gap: "8px",
    marginTop: "12px",
  },
  blockedItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    borderRadius: "18px",
    background: "rgba(239,68,68,0.10)",
    border: "1px solid rgba(239,68,68,0.18)",
  },
  blockedDate: {
    color: "#fffaf0",
    fontSize: "14px",
  },
  blockedType: {
    color: "rgba(255,250,240,0.55)",
    fontSize: "13px",
  },
  removeButton: {
    padding: "7px 12px",
    borderRadius: "999px",
    border: 0,
    background: "rgba(239,68,68,0.20)",
    color: "#fecaca",
    fontWeight: 900,
    fontSize: "12px",
    cursor: "pointer",
  },
  messageBox: {
    marginTop: "16px",
    padding: "14px",
    borderRadius: "18px",
    fontWeight: 800,
    lineHeight: 1.4,
  },
  saveButton: {
    width: "100%",
    marginTop: "16px",
    padding: "16px 22px",
    borderRadius: "999px",
    border: 0,
    background:
      "linear-gradient(135deg, #d4af37 0%, #fff1a6 50%, #b8860b 100%)",
    color: "#08080b",
    fontWeight: 950,
    fontSize: "16px",
    boxShadow: "0 18px 50px rgba(212,175,55,0.25)",
    marginBottom: "8px",
  },
  empty: {
    padding: "40px",
    textAlign: "center" as const,
    color: "rgba(255,250,240,0.55)",
    fontWeight: 800,
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