"use client";

import { useEffect, useState } from "react";
import { axiosAuthInstance } from "@/utils/axios-auth";
import { axiosPublicInstance } from "@/utils/axios-public";
import type { UserProfile } from "@/types/userTypes";
import { ExternalLink, Eye, EyeOff, GithubIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [form, setForm] = useState({ email: "", password: "", username: "", display_name: "" });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosAuthInstance.get("/user/getUser");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Unable to load profile. Sign in again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);

    if (authMode === "signup" && !form.username.trim()) {
      setAuthError("Username is required");
      return;
    }

    setAuthLoading(true);
    try {
      const endpoint = authMode === "signup" ? "/user/signup" : "/user/login";
      const body = authMode === "signup"
        ? { email: form.email, password: form.password, username: form.username, display_name: form.display_name || undefined }
        : { email: form.email, password: form.password };

      const res = await axiosPublicInstance.post(endpoint, body);
      localStorage.setItem("access_token", res.data.accessToken);
      setProfile(res.data.user);
      router.refresh();
    } catch (err: any) {
      const msg = err.response?.data?.error;
      if (typeof msg === "object" && msg !== null) {
        setAuthError(Object.values(msg).flat().join(", "));
      } else {
        setAuthError(msg || "Something went wrong");
      }
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    localStorage.removeItem("access_token");
    setProfile(null);
    router.refresh();
  }

  async function toggleProfileVisibility() {
    if (!profile) return;
    const newVal = !profile.show_profile;
    setSaving(true);
    try {
      await axiosAuthInstance.patch("/user/updateUser", {
        show_profile: newVal,
      });
      setProfile({ ...profile, show_profile: newVal });
    } catch (err) {
      console.error("Failed to update profile visibility", err);
    } finally {
      setSaving(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="bg-background text-foreground">
        <div className="content-max px-6 py-10">
          <div className="animate-pulse space-y-6 max-w-2xl">
            <div className="h-8 bg-muted w-48" />
            <div className="h-4 bg-muted w-96" />
            <div className="h-32 bg-muted w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-background text-foreground">
        <div className="content-max px-6 py-10">
          <div
          style={{ animation: "pageFadeIn 0.4s ease-out" }}
          className="max-w-lg mx-auto"
          >
            <div className="flex items-center gap-4 mb-2">
              <span className="w-1 h-10 bg-foreground" />
              <h1 className="newspaper-headline text-3xl sm:text-4xl">
                {authMode === "signup" ? "Sign Up" : "Sign In"}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground pl-5 mb-8">
              {authMode === "signup"
                ? "Create an account to get started."
                : "Sign in to your account."}
            </p>

            <div className="border border-border bg-card p-8">
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "signup" && (
                  <>
                    <div>
                      <label className="newspaper-byline text-[0.625rem]" htmlFor="su-username">
                        Username
                      </label>
                      <input
                        id="su-username"
                        type="text"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="mt-1 w-full rounded-none border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        placeholder="yourusername"
                        required
                        disabled={authLoading}
                      />
                    </div>
                    <div>
                      <label className="newspaper-byline text-[0.625rem]" htmlFor="su-display">
                        Display Name (optional)
                      </label>
                      <input
                        id="su-display"
                        type="text"
                        value={form.display_name}
                        onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                        className="mt-1 w-full rounded-none border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        placeholder="Your Name"
                        disabled={authLoading}
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="newspaper-byline text-[0.625rem]" htmlFor="auth-email">
                    Email
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1 w-full rounded-none border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="you@example.com"
                    required
                    disabled={authLoading}
                  />
                </div>
                <div>
                  <label className="newspaper-byline text-[0.625rem]" htmlFor="auth-password">
                    Password
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="mt-1 w-full rounded-none border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder={authMode === "signup" ? "At least 8 characters" : "Your password"}
                    required
                    minLength={authMode === "signup" ? 8 : 1}
                    disabled={authLoading}
                  />
                </div>

                {authError && (
                  <p className="text-sm text-red-600">{authError}</p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full rounded-none bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-foreground/90 transition disabled:opacity-50"
                >
                  {authLoading
                    ? "Please wait..."
                    : authMode === "signup"
                      ? "Create Account"
                      : "Sign In"}
                </button>
              </form>

              <hr className="newspaper-rule-thin my-6" />

              <p className="text-xs text-center text-muted-foreground">
                {authMode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => { setAuthMode(authMode === "signup" ? "login" : "signup"); setAuthError(null); }}
                  className="underline text-foreground hover:no-underline"
                >
                  {authMode === "signup" ? "Sign in" : "Sign up"}
                </button>
              </p>

              <hr className="newspaper-rule-thin my-6" />

              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}
                className="flex items-center justify-center gap-2 w-full rounded-none border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-card transition"
              >
                <GithubIcon className="h-4 w-4" />
                Continue with GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background text-foreground">
        <div className="content-max px-6 py-10">
          <div className="border border-border bg-card p-8 text-center">
            <p className="newspaper-body text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const initials = (profile.display_name || profile.username)
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-background text-foreground">
      <div className="content-max px-6 py-10">
        <div style={{ animation: "pageFadeIn 0.4s ease-out" }}>
          {/* — Header — */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <span className="w-1 h-10 bg-foreground" />
              <h1 className="newspaper-headline text-3xl sm:text-4xl">Profile</h1>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              Sign out
            </button>
          </div>
          <p className="text-sm text-muted-foreground pl-5">
            Your account information and preferences.
          </p>
        </div>

        <hr className="newspaper-rule-thin my-8" />

        <div className="grid gap-10 lg:grid-cols-3">
          {/* — Profile card — */}
          <div
            style={{ animation: "pageFadeIn 0.4s ease-out 0.1s both" }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Identity */}
            <div className="border border-border bg-card p-8">
              <div className="flex items-center gap-6">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="w-20 h-20 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-foreground text-background flex items-center justify-center text-xl font-bold">
                    {initials}
                  </div>
                )}
                <div>
                  <h2 className="newspaper-headline text-2xl">
                    {profile.display_name || profile.username}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    @{profile.username}
                  </p>
                  {profile.profile_url && (
                    <a
                      href={profile.profile_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      GitHub Profile
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="border border-border bg-card p-8">
              <h3 className="newspaper-headline text-lg mb-4">Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Username", value: profile.username },
                  { label: "Display Name", value: profile.display_name || "—" },
                  { label: "Email", value: profile.email || "—" },
                  {
                    label: "Member Since",
                    value: formatDate(profile.created_at),
                  },
                  {
                    label: "Last Login",
                    value: profile.last_login_at
                      ? formatDate(profile.last_login_at)
                      : "—",
                  },
                  {
                    label: "Profile Visibility",
                    value: profile.show_profile ? "Public" : "Private",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="newspaper-byline text-[0.625rem]">
                      {item.label}
                    </p>
                    <p className="text-sm mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* — Privacy sidebar — */}
          <div
            style={{ animation: "pageFadeIn 0.4s ease-out 0.2s both" }}
            className="space-y-6"
          >
            <div className="border border-border bg-card p-8">
              <h3 className="newspaper-headline text-lg mb-4">Privacy</h3>
              <p className="newspaper-body text-sm text-muted-foreground mb-6">
                Control whether your profile and contribution data is visible to
                other users.
              </p>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Show profile</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {profile.show_profile
                      ? "Your profile is publicly visible"
                      : "Your profile is hidden"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleProfileVisibility}
                  disabled={saving}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors focus:outline-none focus:ring-1 focus:ring-ring ${
                    profile.show_profile
                      ? "bg-foreground border-foreground"
                      : "bg-muted border-border"
                  } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span
                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-sm transition-transform ${
                      profile.show_profile ? "translate-x-6" : "translate-x-1"
                    }`}
                  >
                    {profile.show_profile ? (
                      <Eye className="h-3 w-3 text-foreground" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-muted-foreground" />
                    )}
                  </span>
                </button>
              </div>

              <hr className="newspaper-rule-thin my-6" />

              <div className="text-xs text-muted-foreground leading-relaxed">
                <p>
                  When your profile is public, your username, display name, and
                  avatar may appear in community leaderboards and contributor
                  listings. Your email is never shared publicly.
                </p>
              </div>
            </div>

            {/* — Quick links — */}
            <div className="border border-border bg-card p-8">
              <h3 className="newspaper-headline text-lg mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { href: "/dashboard/home", label: "Discover Repos" },
                  { href: "/dashboard/home/issues", label: "Browse Issues" },
                  { href: "/dashboard/home/gsoc", label: "GSoC Projects" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    → {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
