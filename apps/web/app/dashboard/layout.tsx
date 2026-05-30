"use client";

import Navbar from "@/components/dashboard/Navbar";
import { motion } from "framer-motion";

const sidebar = {
  hidden: { x: -16, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const content = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="border-b border-border bg-card"
      >
        <div className="content-max flex items-center justify-between h-12 px-4">
          <span className="newspaper-headline text-lg tracking-tight">OSSBeat</span>
          <span className="text-[0.625rem] uppercase tracking-widest text-muted-foreground">
            Dashboard
          </span>
        </div>
      </motion.header>

      <div className="flex flex-1">
        <motion.aside
          variants={sidebar}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-56 shrink-0 border-r border-border bg-card p-4 hidden md:block"
        >
          <Navbar />
        </motion.aside>

        <motion.main
          variants={content}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex-1 overflow-y-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
