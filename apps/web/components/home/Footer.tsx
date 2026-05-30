import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="content-max section-padding">
        <div className="text-center mb-8">
          <h2 className="newspaper-headline text-3xl sm:text-4xl">
            <Link href="/" className="text-background">OSSBeat</Link>
          </h2>
          <p className="text-sm text-background/70 mt-2">
            Your gateway to open source contributions.
          </p>
        </div>

        <hr className="border-background/30 mb-8" />

        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-background/60 mb-3">
              Sections
            </p>
            <ul className="space-y-2">
              {[
                { href: "#features", label: "Features" },
                { href: "#about", label: "About" },
                { href: "#demo", label: "Demo" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/80 hover:text-background transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-background/60 mb-3">
              Connect
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              {[
                { icon: Github, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="flex h-9 w-9 items-center justify-center border border-background/30 text-background/80 hover:text-background hover:border-background/60 transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-background/60 mb-3">
              Colophon
            </p>
            <p className="text-sm text-background/70 leading-relaxed">
              OSSBeat is an open source project. Built with Next.js and Tailwind
              CSS. Set in Geist and Playfair Display.
            </p>
          </div>
        </div>

        <hr className="border-background/30 my-8" />

        <p className="text-center text-xs text-background/50">
          &copy; {new Date().getFullYear()} OSSBeat. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
