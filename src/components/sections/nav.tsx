"use client";

import { motion } from "framer-motion";

const links = [
  { href: "#features", label: "Modes" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#impact", label: "Impact" },
  { href: "#demo", label: "Demo" },
] as const;

export function Nav() {
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-5 sm:px-6">
        <a href="#" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]">
            A
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">
            Adapt<span className="text-primary">ED</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#demo" className="btn-primary hidden h-9 px-4 text-sm md:inline-flex">
          Try the demo
        </a>
        <a
          href="#demo"
          className="btn-primary inline-flex h-9 px-4 text-sm md:hidden"
        >
          Demo
        </a>
      </div>
    </motion.header>
  );
}
