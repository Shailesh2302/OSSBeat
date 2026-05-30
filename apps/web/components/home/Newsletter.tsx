"use client";

import { useState, FormEvent } from "react";
import { axiosPublicInstance } from "@/utils/axios-public";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await axiosPublicInstance.post("/newsletter/subscribe", { email });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="section-padding bg-muted">
      <div className="content-max">
        <div className="max-w-2xl mx-auto text-center">
          <div>
            <div className="newspaper-section-title mb-6">
              <span>Stay Informed</span>
            </div>
            <h2 className="newspaper-headline text-3xl sm:text-4xl text-center">
              The Open Source Daily
            </h2>
            <p className="newspaper-body text-muted-foreground mt-4 max-w-lg mx-auto">
              Get weekly digests of trending repos, new GSoC opportunities, and
              tips for making your first contribution — delivered to your inbox.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === "loading"}
              className="flex-1 h-12 px-4 border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-12 px-8 bg-foreground text-background text-sm uppercase tracking-widest font-semibold hover:bg-foreground/90 transition disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {status === "success" && (
            <p className="text-sm text-foreground mt-3">
              ✓ You&apos;re subscribed! Check your inbox soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600 mt-3">
              Something went wrong. Try again later.
            </p>
          )}

          <p className="text-[0.625rem] text-muted-foreground mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
