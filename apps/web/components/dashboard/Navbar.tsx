"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const items = [
  { href: "/dashboard/home", label: "Home" },
  { href: "/dashboard/home/hacktoberfest", label: "HacktoberFest" },
  { href: "/dashboard/home/issues", label: "Issues" },
  { href: "/dashboard/home/gsoc", label: "GSoC" },
  { href: "/dashboard/home/profile", label: "Profile" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium px-3 py-2 transition-colors ${
              isActive
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
