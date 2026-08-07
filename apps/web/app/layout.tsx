import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { playfair } from "./fonts";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "OSSBeat — The Open Source Daily",
  description: "Discover suitable OSS repositories, build strong fundamentals, get expert mentorship for GSoC, and make meaningful contributions.",
  openGraph: {
    images: [
      {
        url: "/ossbeat-logo.png",
        width: 1200,
        height: 700,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${geist.className} ${playfair.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen w-full bg-background">
            {children}
          </main>
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  );
}
