"use client";

import { Link } from "lucide-react";
import Demo from "./navbar/demo";
import Feature from "./navbar/Feature";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-16 z-50 bg-transparent">
      <div className="flex h-full w-full items-center justify-between px-8">
        {/* Left: App name */}
        <div className="text-black font-semibold text-lg tracking-wide">
          OSSBeat
        </div>

        {/* Right: Links */}
        <div>
        <ul className="flex items-center gap-8 text-sm font-medium text-neutral-700">
          <li className="cursor-pointer hover:text-black transition">
           
           <a href="#home"  className="text-gray-700 hover:text-foreground-700 transition-colors duration-200">
           Home
          </a>
          </li>
          <li className="cursor-pointer hover:text-black transition">
          <a href="#features"  className="text-gray-700 hover:text-foreground-700 transition-colors duration-200">
           Features
          </a>
          </li>
          <li className="cursor-pointer hover:text-black transition">
            <a href="#demo"  className="text-gray-700 hover:text-foreground-700 transition-colors duration-200">
            Demo
            </a>
          </li>
          <li className="cursor-pointer hover:text-black transition">
           <a href="#about"  className="text-gray-700 hover:text-foreground-700 transition-colors duration-200">
            About
            </a>
          </li>
          <li className="cursor-pointer hover:text-black transition">
           <a href="#contact"  className="text-gray-700 hover:text-foreground-700 transition-colors duration-200">
            Contact
            </a>
          </li>
        </ul>
        </div>
      </div>
    </nav>
  );
}
