"use client";

import { useState, FormEvent } from "react";
import { Mail, MapPin, Github, Twitter, Linkedin } from "lucide-react";
import { axiosPublicInstance } from "@/utils/axios-public";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");
    try {
      await axiosPublicInstance.post("/contact/sendMessage", form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="section-padding bg-muted scroll-mt-24"
    >
      <div className="content-max">
        <div className="mb-12">
          <div className="newspaper-section-title mb-6">
            <span>Contact</span>
          </div>
          <h2 className="newspaper-headline text-3xl sm:text-4xl md:text-5xl text-center">
            Get in touch
          </h2>
          <p className="newspaper-subhead text-center text-base mt-3 max-w-2xl mx-auto">
            Questions, feedback, or feature suggestions? We&apos;d love to hear from you.
          </p>
        </div>

        <hr className="newspaper-rule-thin mb-10" />

        <div className="grid gap-10 lg:grid-cols-2">
          {/* — Contact info — */}
          <div className="border border-border p-8 bg-card">
            <h3 className="newspaper-headline text-xl mb-6">Reach us</h3>
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "hello@ossbeat.dev" },
                { icon: MapPin, label: "Location", value: "Remote — Worldwide" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 items-center justify-center bg-foreground text-background shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="newspaper-byline text-[0.625rem]">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr className="newspaper-rule-thin my-6" />

            <div>
              <p className="newspaper-byline text-[0.625rem] mb-3">Stay connected</p>
              <div className="flex gap-4">
                {[Github, Twitter, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:bg-card transition"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* — Message form — */}
          <div className="border border-border p-8 bg-card">
            <h3 className="newspaper-headline text-xl mb-6">Send a message</h3>
            {status === "success" ? (
              <div className="border border-border p-6 text-center">
                <p className="text-sm text-foreground font-semibold">
                  ✓ Message sent! We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="newspaper-byline text-[0.625rem]" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-1 w-full rounded-none border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Your name"
                    required
                    disabled={status === "loading"}
                  />
                </div>
                <div>
                  <label className="newspaper-byline text-[0.625rem]" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1 w-full rounded-none border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="you@example.com"
                    required
                    disabled={status === "loading"}
                  />
                </div>
                <div>
                  <label className="newspaper-byline text-[0.625rem]" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="mt-1 w-full resize-none rounded-none border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="How can we help?"
                    required
                    disabled={status === "loading"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-none bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-foreground/90 transition disabled:opacity-50"
                >
                  {status === "loading" ? "Sending..." : "Send message"}
                </button>
                {status === "error" && (
                  <p className="text-sm text-red-600 text-center">
                    Failed to send. Please try again.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
