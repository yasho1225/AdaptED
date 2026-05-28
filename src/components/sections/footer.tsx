export function Footer() {
  return (
    <footer className="section-band py-10 md:py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 text-center sm:px-6 md:flex-row md:text-left">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-card text-sm font-semibold text-card-foreground shadow-sm">
            A
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.02em] text-foreground">
            Adapt<span className="text-primary">ED</span>
          </span>
        </div>
        <p className="text-[14px] text-muted-foreground">
          One lesson. Every learner. · Hackathon MVP
        </p>
        <p className="text-[13px] text-muted-foreground">
          © {new Date().getFullYear()} AdaptED
        </p>
      </div>
    </footer>
  );
}
