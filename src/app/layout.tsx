import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next, Fraunces } from "next/font/google";
import { MotionProvider } from "@/components/motion/motion-provider";
import "./globals.css";

const body = Atkinson_Hyperlegible_Next({ subsets: ["latin"], variable: "--font-body", display: "swap", adjustFontFallback: false, fallback: ["system-ui", "sans-serif"] });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display-face", display: "swap", axes: ["opsz", "SOFT"] });

export const metadata: Metadata = {
  title: "AdaptED — One lesson. Every learner.",
  description:
    "AdaptED helps teachers turn one assignment into accessible versions for students with dyslexia, ADHD, auditory processing differences, and autism — keeping the learning goals intact and showing exactly what changed and why.",
};

export const viewport: Viewport = {
  themeColor: "#14318a",
};

/** Applies saved calm mode before paint (no flash, no motion surprise). */
const bootScript = `(function(){try{var d=document.documentElement;var c=localStorage.getItem('adapted-calm');if(c===null){c=matchMedia('(prefers-reduced-motion: reduce)').matches?'true':'false'}d.dataset.calm=c}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body suppressHydrationWarning>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
