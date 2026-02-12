"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function LoginForm() {
  const supabase = createClient();
  const router = useRouter();

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const circleRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  /* ------------------ INTRO SEQUENCE ------------------ */
  useEffect(() => {
    const tl = gsap.timeline();

    /* Halo collapse */
    if (circleRef.current) {
      gsap.set(circleRef.current, {
        transformOrigin: "50% 50%",
        scale: 18,
        filter: "blur(90px)",
        opacity: 1,
      });

      tl.to(circleRef.current, {
        scale: 3,
        filter: "blur(40px)",
        duration: 0.0,
        ease: "power3.out",
      })
        .to(circleRef.current, {
          scale: 1.25,
          filter: "blur(18px)",
          duration: 1.8,
          ease: "power4.out",
        })
        .to(circleRef.current, {
          scale: 1,
          filter: "blur(12px)",
          duration: 1.2,
          ease: "expo.out",
        });
    }

    /* Logo settle */
    if (logoRef.current) {
      gsap.set(logoRef.current, { scale: 0.82, opacity: 0 });

      tl.to(
        logoRef.current,
        {
          scale: 1.05,
          opacity: 1,
          duration: 1.6,
          ease: "power3.out",
        },
        "-=1.4"
      ).to(logoRef.current, {
        scale: 1,
        duration: 1.1,
        ease: "power2.out",
      });
    }

    /* Card rises AFTER logo */
    if (cardRef.current) {
      gsap.set(cardRef.current, { y: 120, opacity: 0 });

      tl.to(cardRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out",
      }, "+=0.25");
    }

    return () => {
      tl.kill();
    };
  }, []);

  /* ------------------ LOADING ENERGY ------------------ */
  useEffect(() => {
    let tween: gsap.core.Tween | undefined;

    if (loading && circleRef.current) {
      tween = gsap.to(circleRef.current, {
        scale: 1.15,
        filter: "blur(18px)",
        duration: 1.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    } else if (circleRef.current) {
      gsap.killTweensOf(circleRef.current);
      gsap.to(circleRef.current, {
        scale: 1,
        filter: "blur(12px)",
        duration: 1.4,
      });
    }

    return () => {
      tween?.kill();
    };
  }, [loading]);

  /* ------------------ LOGIN ------------------ */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const form = new FormData(e.currentTarget);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.get("email") as string,
      password: form.get("password") as string,
    });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }
    await fetch("/api/user/firstTimeLogin", {
    method: "POST",
    });


    setMsg("Logged in successfully");

    router.refresh();
    router.push("/home");
  }

  /* ------------------ UI ------------------ */

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#FFF8E7' }}>
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <div className="relative w-88 h-88 md:w-104 md:h-104 mb-6">

            <div
              ref={circleRef}
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: '#E0A11B' }}
            />

            <div
              ref={logoRef}
              className="relative w-full h-full rounded-full overflow-hidden shadow-2xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '4px solid #E0A11B',
                boxShadow: '0 10px 40px rgba(224, 161, 27, 0.3)'
              }}
            >
              <Image
                src="/logo.png"
                alt="Srinibas Vastra"
                width={316}
                height={316}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>

          <p className="text-lg font-light tracking-wide" style={{ color: '#5A3A22' }}>
            Welcome to the Heritage Collection
          </p>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          className="rounded-3xl shadow-2xl p-8 backdrop-blur-sm"
          style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #E0A11B',
            boxShadow: '0 20px 60px rgba(43, 26, 18, 0.15)'
          }}
        >
          <h2 className="text-2xl font-semibold text-center mb-8" style={{ color: '#2B1A12' }}>
            Sign In to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input name="email" type="email" required placeholder="Email"
              className="w-full rounded-xl px-4 py-3"
              style={{ background: '#FFF8E7', border: '2px solid #5A3A22' }}
            />

            <input name="password" type="password" required placeholder="Password"
              className="w-full rounded-xl px-4 py-3"
              style={{ background: '#FFF8E7', border: '2px solid #5A3A22' }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3.5 font-semibold shadow-lg disabled:opacity-50"
              style={{ background: '#E0A11B', color: '#2B1A12' }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <div>
              don't have an account?{" "}
              <a href="/signup" className="font-medium" style={{ color: '#5A3A22' }}>
                Sign Up
              </a>
            </div>
         
           

            {msg && (
              <div className="text-sm text-center">{msg}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
