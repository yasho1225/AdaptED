export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 md:py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 text-center sm:px-6 md:flex-row md:text-left">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-card text-sm font-bold text-card-accent shadow-[var(--shadow-soft)]">
            A
          </span>
          <div>
            <span className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">
              Adapt<span className="text-primary">ED</span>
            </span>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Education adapts to students — not the other way around.
            </p>
          </div>
        </div>
        <a
          href="#demo"
          className="text-[14px] font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          Try the live demo again
        </a>
        <p className="text-[13px] text-muted-foreground">
          © {new Date().getFullYear()} AdaptED · Hackathon MVP
        </p>
      </div>
    </footer>
  );
}
