import type { AccessibilityMode } from "./types";

export type PitchSlideId =
  | "title"
  | "problem"
  | "insight"
  | "demo"
  | "proof"
  | "how-it-works"
  | "differentiation"
  | "close";

export type PitchSlide = {
  id: PitchSlideId;
  eyebrow?: string;
  headline: string;
  subhead?: string;
  speakerNotes: string;
};

export const PITCH_SLIDES: PitchSlide[] = [
  {
    id: "title",
    eyebrow: "Pitch deck",
    headline: "One lesson. Every learner.",
    subhead: "adapted-fawn.vercel.app",
    speakerNotes:
      "AdaptED helps teachers take one assignment and instantly adapt it for students who learn differently — dyslexia, ADHD, auditory processing, and autism. I'll show you in 30 seconds.",
  },
  {
    id: "problem",
    eyebrow: "The problem",
    headline: "Education asks students to adapt — not the other way around.",
    speakerNotes:
      "Every teacher has sent home the same worksheet to 30 kids. But one in five processes information differently. The fix today is manual — teachers stay up late simplifying, chunking, reformatting. That's 7+ hours a week, and it's never consistent. We think the assignment should adapt to the learner, not the reverse.",
  },
  {
    id: "insight",
    eyebrow: "The insight",
    headline: "Same lesson. Four learning experiences.",
    subhead:
      "Accessibility isn't one setting — it's structure: how content is chunked, sequenced, and organized.",
    speakerNotes:
      "A student with dyslexia needs short chunks and simpler scanning. ADHD needs one clear step at a time. Auditory processing needs written structure from spoken-style content. Autism needs predictable sections with zero ambiguity. These aren't four synonyms — they're four different document structures.",
  },
  {
    id: "demo",
    eyebrow: "The product",
    headline: "Paste once. Adapt instantly.",
    subhead: "Upload · Pick mode · Share — under 30 seconds, no sign-up.",
    speakerNotes:
      "This is AdaptED. I'm pasting a real assignment about photosynthesis. Watch what happens when I switch modes. Same content. Four completely different reading experiences. Under 30 seconds. Switch to the live site for the demo if presenting live.",
  },
  {
    id: "proof",
    eyebrow: "Proof",
    headline: "Not a rewrite. A restructure.",
    speakerNotes:
      "Notice we didn't just swap words. We changed how the information is packaged — chunk size, emphasis, sequence. That's what makes this useful in a real classroom.",
  },
  {
    id: "how-it-works",
    eyebrow: "How it works",
    headline: "Three steps. No reformatting.",
    speakerNotes:
      "No LMS integration required for the demo. Teacher drops in what they already have, picks how the student needs to experience it, and gets a shareable version. We also support translation — Spanish, Hindi, French, simplified English — on top of the accessibility mode.",
  },
  {
    id: "differentiation",
    eyebrow: "Why AdaptED",
    headline: "AI that changes structure — with a demo that never breaks.",
    speakerNotes:
      "Lots of tools summarize or simplify. AdaptED changes document architecture per learning need. We use Gemini for quality, but built a local fallback engine so demos never die when API quota runs out — important for classrooms and for today.",
  },
  {
    id: "close",
    eyebrow: "Thank you",
    headline: "Every student deserves access. Teachers deserve time back.",
    subhead: "Try the live demo → adapted-fawn.vercel.app",
    speakerNotes:
      "AdaptED makes accessible materials the default, not the exception. The demo is live — visit adapted-fawn.vercel.app. Thank you.",
  },
];

export const PITCH_PROBLEM_STATS = [
  {
    value: "1 in 5",
    label: "students face learning accessibility barriers",
  },
  {
    value: "7+ hrs",
    label: "per week teachers spend adapting materials",
  },
  {
    value: "Same",
    label: "rigid assignment — student expected to change",
  },
] as const;

export const PITCH_MODE_CARDS: {
  id: AccessibilityMode;
  icon: string;
  title: string;
  blurb: string;
  tint: string;
  border: string;
  accent: string;
}[] = [
  {
    id: "dyslexia",
    icon: "Aa",
    title: "Dyslexia",
    blurb: "Short chunks, simpler words",
    tint: "bg-mode-dyslexia-muted",
    border: "border-mode-dyslexia-border",
    accent: "text-mode-dyslexia",
  },
  {
    id: "adhd",
    icon: "1→",
    title: "ADHD",
    blurb: "One clear step at a time",
    tint: "bg-mode-adhd-muted",
    border: "border-mode-adhd-border",
    accent: "text-mode-adhd",
  },
  {
    id: "apd",
    icon: "▤",
    title: "APD",
    blurb: "Headings and bullet notes",
    tint: "bg-mode-apd-muted",
    border: "border-mode-apd-border",
    accent: "text-mode-apd",
  },
  {
    id: "autism",
    icon: "☰",
    title: "Autism",
    blurb: "Same layout every lesson",
    tint: "bg-mode-autism-muted",
    border: "border-mode-autism-border",
    accent: "text-mode-autism",
  },
];

export const PITCH_HOW_IT_WORKS = [
  {
    step: "01",
    title: "Upload or paste",
    description: "Worksheet, PDF, notes, or assignment",
  },
  {
    step: "02",
    title: "Choose a mode",
    description: "Dyslexia, ADHD, APD, or autism structure",
  },
  {
    step: "03",
    title: "Share instantly",
    description: "Compare, download PDF, or translate",
  },
] as const;

export const PITCH_DIFFERENTIATORS = [
  {
    title: "Structural transforms",
    description: "Not cosmetic paraphrasing — real document architecture per mode",
  },
  {
    title: "Gemini + local fallback",
    description: "AI quality with quota-safe demos that never break",
  },
  {
    title: "Teacher-first",
    description: "Works with existing materials — no new curriculum required",
  },
] as const;

export const DEMO_SITE_URL = "https://adapted-fawn.vercel.app";
