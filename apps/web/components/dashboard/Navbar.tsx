import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="flex flex-col gap-3">
      {[
        { href: "/dashboard/home", label: "Home" },
        { href: "/dashboard/home/hacktoberfest", label: "HacktoberFest" },
        { href: "/dashboard/home/issues", label: "Issues" },
        { href: "/dashboard/home/gsoc", label: "GSoC" },
      ].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="
            group relative rounded-md p-[0.5px]
            bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)]
            transition-all duration-300
            hover:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)]
          "
        >
          <span
            className="
              flex items-center justify-center
              rounded-md px-3 py-2
              bg-background
              transition-all duration-300
              group-hover:bg-background/90
              group-hover:shadow-[0_0_6px_rgba(255,255,255,0.15)]
              text-center
            "
          >
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
