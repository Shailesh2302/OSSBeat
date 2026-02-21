"use client";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-50 bg-transparent">
      <div className="flex h-full w-full items-center justify-between px-8">
        {/* Left: App name */}
        <div className="text-black font-semibold text-lg tracking-wide">
          OSSBeat
        </div>

        {/* Right: Links */}
        <ul className="flex items-center gap-8 text-sm font-medium text-neutral-700">
          <li className="cursor-pointer hover:text-black transition">
            Home
          </li>
          <li className="cursor-pointer hover:text-black transition">
            Features
          </li>
          <li className="cursor-pointer hover:text-black transition">
            Demo
          </li>
          <li className="cursor-pointer hover:text-black transition">
            About
          </li>
          <li className="cursor-pointer hover:text-black transition">
            Contact
          </li>
        </ul>
      </div>
    </nav>
  );
}
