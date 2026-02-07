"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const supabase = createClient();
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
     options: {
    emailRedirectTo: "http://localhost:3000/auth/callback",
  },
    });

    if (error) {
      setMsg(`Error: ${error.message}`);
      setLoading(false);
      return;
    }

    // Check if email confirmation is required
    if (data?.user?.identities?.length === 0) {
      setMsg("This email is already registered. Please login instead.");
      setLoading(false);
      return;
    }

    // If email confirmation is disabled in Supabase, user is logged in immediately
    if (data.session) {
      setMsg("Account created successfully! Redirecting...");
      setTimeout(() => {
        router.refresh();
        router.push("/");
      }, 1000);
    } else {
      // Email confirmation is enabled
      setMsg("Success! Check your email for a confirmation link.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required placeholder="Email" />
      <input name="password" type="password" required placeholder="Password" />

      <button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Sign up"}
      </button>

      {msg && <p>{msg}</p>}
    </form>
  );
}
