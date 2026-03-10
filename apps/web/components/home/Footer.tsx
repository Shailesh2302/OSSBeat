import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Github className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-foreground">OSSBeat</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your gateway to open source contributions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-muted-foreground text-sm hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-muted-foreground text-sm hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="#demo" className="text-muted-foreground text-sm hover:text-foreground">
                  Demo
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-muted-foreground text-sm hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 OSSBeat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
