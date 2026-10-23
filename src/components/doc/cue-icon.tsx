import {
  BookOpen,
  Calculator,
  CircleCheck,
  Ear,
  Eye,
  Lightbulb,
  MessagesSquare,
  PencilLine,
  PenTool,
  PersonStanding,
  type LucideIcon,
} from "lucide-react";
import type { CueIcon as CueIconId } from "@/lib/adapt/types";

const ICONS: Record<CueIconId, { Icon: LucideIcon; label: string }> = {
  read: { Icon: BookOpen, label: "Read" },
  write: { Icon: PencilLine, label: "Write" },
  think: { Icon: Lightbulb, label: "Think" },
  talk: { Icon: MessagesSquare, label: "Talk" },
  listen: { Icon: Ear, label: "Listen" },
  look: { Icon: Eye, label: "Look" },
  move: { Icon: PersonStanding, label: "Move" },
  check: { Icon: CircleCheck, label: "Check" },
  calc: { Icon: Calculator, label: "Calculate" },
  draw: { Icon: PenTool, label: "Draw" },
};

/** Visual cue with a visible text label so meaning never depends on the picture alone. */
export function CueIcon({ icon, compact = false }: { icon: CueIconId; compact?: boolean }) {
  const { Icon, label } = ICONS[icon];
  return (
    <span className="inline-flex shrink-0 flex-col items-center gap-0.5 text-[color:var(--need,var(--brand))]" title={label}>
      <span className="grid size-8 place-items-center rounded-lg bg-[color:var(--need-soft,var(--brand-soft))]">
        <Icon className="size-4" aria-hidden />
      </span>
      {!compact && <span className="text-[0.65rem] font-bold uppercase tracking-wide">{label}</span>}
      {compact && <span className="sr-only">{label}</span>}
    </span>
  );
}
