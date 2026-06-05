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
      <section style={styles.card}>
        <p style={styles.badge}>Barber Login</p>

        <h1 style={styles.title}>Einloggen</h1>

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

        <Link href="/" style={styles.back}>
          ← Zur Startseite
        </Link>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    width: "min(520px, 100%)",
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
  },
  message: {
    padding: "14px",
    borderRadius: "18px",
    background: "#fee2e2",
    color: "#991b1b",
    fontWeight: 800,
  },
  button: {
    padding: "16px 22px",
    borderRadius: "999px",
    border: 0,
    background: "#111",
    color: "#fff",
    fontWeight: 900,
    fontSize: "16px",
    cursor: "pointer",
  },
  back: {
    display: "inline-block",
    marginTop: "22px",
    color: "#0071e3",
    textDecoration: "none",
    fontWeight: 800,
  },
};