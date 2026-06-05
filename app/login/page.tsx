"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setMessage("Login fehlgeschlagen: " + error.message);
      return;
    }

    router.push("/barber");
  }

  return (
    <main style={styles.page}>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <section style={styles.card}>
        <div style={styles.statusBar}>
          <Link href="/" style={styles.back}>
            ← Home
          </Link>

          <span>SalonFlow</span>
        </div>

        <div style={styles.appIcon}>◆</div>

        <p style={styles.badge}>Barber Login</p>

        <h1 style={styles.title}>
          Einloggen.
        </h1>

        <p style={styles.text}>
          Melde dich an, um Terminanfragen zu bestätigen, abzulehnen oder zu löschen.
        </p>

        <form onSubmit={handleLogin} style={styles.form}>
          <label style={styles.label}>
            E-Mail
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="barber@example.com"
            />
          </label>

          <label style={styles.label}>
            Passwort
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="••••••••"
            />
          </label>

          {message && <div style={styles.message}>{message}</div>}

          <button style={styles.button} disabled={isLoading}>
            {isLoading ? "Wird eingeloggt..." : "Einloggen"}
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

  card: {
    position: "relative" as const,
    zIndex: 2,
    width: "min(430px, 100%)",
    minHeight: "620px",
    borderRadius: "46px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 40px 140px rgba(0,0,0,0.45)",
    padding: "28px",
    backdropFilter: "blur(30px)",
  },

  statusBar: {
    display: "flex",
    justifyContent: "space-between",
    color: "rgba(255,255,255,0.72)",
    fontSize: "13px",
    fontWeight: 800,
    marginBottom: "28px",
  },

  back: {
    color: "rgba(255,255,255,0.72)",
    textDecoration: "none",
    fontWeight: 800,
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
    fontSize: "52px",
    letterSpacing: "-0.065em",
    margin: "12px 0 12px",
    lineHeight: 1,
    color: "#fffaf0",
  },

  text: {
    color: "rgba(255,250,240,0.75)",
    fontSize: "17px",
    lineHeight: 1.45,
    fontWeight: 600,
  },

  form: {
    display: "grid",
    gap: "16px",
    marginTop: "28px",
  },

  label: {
    display: "grid",
    gap: "8px",
    color: "rgba(255,250,240,0.85)",
    fontSize: "13px",
    fontWeight: 900,
  },

  input: {
    padding: "16px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "#fffaf0",
    fontSize: "15px",
    outline: "none",
  },

  message: {
    padding: "14px",
    borderRadius: "18px",
    background: "rgba(239,68,68,0.16)",
    color: "#fecaca",
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
    cursor: "pointer",
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