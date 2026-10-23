import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Mono, Atkinson_Hyperlegible_Next } from "next/font/google";
import localFont from "next/font/local";
import { MotionProvider } from "@/components/motion/motion-provider";
import "./globals.css";

const body = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--font-body", display: "swap", adjustFontFallback: false, fallback: ["system-ui", "sans-serif"] });
// Display face for headlines only: variable width + optical size, so big headings can be set tight and
// condensed while everything students read stays in Atkinson Hyperlegible.
// Bricolage Grotesque (OFL), subset to ASCII + curly quotes/dashes and weights 700–800: 75 KB instead of 131 KB.
// Rebuild with fontTools if headlines ever need other characters (missing glyphs fall back to Atkinson).
const display = localFont({
  src: "./fonts/BricolageGrotesque-Variable-subset.woff2",
  variable: "--font-display-face",
  display: "swap",
  weight: "700 800",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
  fallback: ["system-ui", "sans-serif"],
});
const mono = Atkinson_Hyperlegible_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap", adjustFontFallback: false, fallback: ["ui-monospace", "monospace"] });

const description =
  "AdaptED helps teachers turn one assignment into accessible versions for students with dyslexia, ADHD, auditory processing differences, and autism — keeping the learning goals intact and showing exactly what changed and why.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://adapted-fawn.vercel.app"),
  title: "AdaptED — One lesson. Every learner.",
  description,
  openGraph: { title: "AdaptED — One lesson. Every learner.", description, type: "website", siteName: "AdaptED" },
  twitter: { card: "summary_large_image", title: "AdaptED — One lesson. Every learner.", description },
};

export const viewport: Viewport = {
  themeColor: "#1E40AF",
};

/** Applies saved calm mode before paint (no flash, no motion surprise). */
const bootScript = `(function(){try{var d=document.documentElement;var c=localStorage.getItem('adapted-calm');if(c===null){c=matchMedia('(prefers-reduced-motion: reduce)').matches?'true':'false'}d.dataset.calm=c}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body suppressHydrationWarning>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
