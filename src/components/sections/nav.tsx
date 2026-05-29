"use client";

import { motion } from "framer-motion";

const links = [
  { href: "#demo", label: "Live demo" },
  { href: "#features", label: "Modes" },
] as const;

export function Nav() {
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="glass-nav fixed top-0 z-50 w-full"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <a
          href="#"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="text-[17px] font-semibold tracking-[-0.03em] text-foreground">
            Adapt<span className="text-primary">ED</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-[14px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#demo" className="btn-primary hidden !h-9 !min-w-0 !px-5 !text-[13px] md:inline-flex">
          Try the demo
        </a>
        <a href="#demo" className="btn-primary !h-9 !min-w-0 !px-4 !text-[13px] md:hidden">
          Demo
        </a>
      </div>
    </motion.header>
  );
}
