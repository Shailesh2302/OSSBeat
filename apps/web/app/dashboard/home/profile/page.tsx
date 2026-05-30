"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { axiosAuthInstance } from "@/utils/axios-auth";
import type { UserProfile } from "@/types/userTypes";
import { ExternalLink, Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosAuthInstance.get("/user/getUser");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Unable to load profile. Make sure you are signed in.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

  if (!profile) return null;

  const initials = (profile.display_name || profile.username)
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-background text-foreground">
      <div className="content-max px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* — Header — */}
          <div className="flex items-center gap-4 mb-2">
            <span className="w-1 h-10 bg-foreground" />
            <h1 className="newspaper-headline text-3xl sm:text-4xl">Profile</h1>
          </div>
          <p className="text-sm text-muted-foreground pl-5">
            Your account information and preferences.
          </p>
        </motion.div>

        <hr className="newspaper-rule-thin my-8" />

        <div className="grid gap-10 lg:grid-cols-3">
          {/* — Profile card — */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
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
          </motion.div>

          {/* — Privacy sidebar — */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}
