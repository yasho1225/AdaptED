import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "AdaptED: One lesson. Every learner. A worksheet adapted for dyslexia, ADHD, auditory processing, and autism.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NEEDS: [string, string][] = [
  ["Dyslexia", "#a9d4ff"],
  ["ADHD", "#ffc891"],
  ["Auditory Processing", "#9eebc8"],
  ["Autism", "#e2c6ff"],
];

export default async function OpengraphImage() {
  const font = (f: string) => readFile(join(process.cwd(), "assets/fonts", f));
  const [display, regular, bold] = await Promise.all([font("BricolageGrotesque-CondensedExtraBold.ttf"), font("AtkinsonHyperlegibleNext-Regular.ttf"), font("AtkinsonHyperlegibleNext-Bold.ttf")]);
  const ink = "#0f1f5c";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#1e40af", color: "white", fontFamily: "Atkinson", padding: "64px 72px" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 600 }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 700 }}>
            Adapt<span style={{ marginLeft: 4, padding: "0 6px", borderRadius: 6, background: "#ffd43b", color: ink }}>ED</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Bricolage", fontSize: 128, lineHeight: 0.9, letterSpacing: -4 }}>
            <span>One lesson.</span>
            <span style={{ display: "flex", flexDirection: "column" }}>
              Every learner.
              <span style={{ height: 14, marginTop: 10, borderRadius: 7, background: "#ffd43b" }} />
            </span>
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: "rgba(255,255,255,0.88)" }}>Adapt any assignment for the student in front of you. Same learning goals.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 56, flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", background: "#fdfcf8", color: ink, borderRadius: 18, padding: "30px 32px", boxShadow: "0 30px 60px -20px rgba(8,20,70,0.6)", transform: "rotate(2deg)" }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>Where energy comes from</div>
            <div style={{ display: "flex", marginTop: 16, padding: "12px 14px", borderRadius: 10, background: "#e6efff", fontSize: 21, fontWeight: 700, lineHeight: 1.35 }}>
              Photosynthesis turns light energy into food energy.
            </div>
            <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.45 }}>Every living thing needs energy. In almost every ecosystem on Earth, that energy starts with photosynthesis.</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
              {NEEDS.map(([label, color]) => (
                <span key={label} style={{ display: "flex", padding: "6px 12px", borderRadius: 999, background: color, color: ink, fontSize: 18, fontWeight: 700 }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: display, weight: 800, style: "normal" },
        { name: "Atkinson", data: regular, weight: 400, style: "normal" },
        { name: "Atkinson", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
