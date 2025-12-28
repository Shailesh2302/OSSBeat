"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    // Store the token
    localStorage.setItem("access_token", token);
    setStatus("success");

    // Redirect to dashboard
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }, [searchParams, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Authenticating...</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Authentication failed. No token provided.</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1>Authentication Successful!</h1>
      <p>Redirecting...</p>
    </div>
  );
}
