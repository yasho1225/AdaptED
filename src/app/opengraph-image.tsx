import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "AdaptED: One lesson. Every learner. A worksheet adapted for dyslexia, ADHD, auditory processing, and autism.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BLUE = "#0e2fa3";
const NAVY = "#0a1b52";
const YELLOW = "#ffd43b";
const PAPER = "#fefdf8";

const NEEDS: [string, string][] = [
  ["Dyslexia", "#006697"],
  ["ADHD", "#ab4400"],
  ["Auditory Processing", "#006d4b"],
  ["Autism", "#6f3e9d"],
];

/** The site's motif, a highlighter's chisel cut, drawn as a polygon behind its content. */
function Chisel({ width, height, cut, color, start = false }: { width: number; height: number; cut: number; color: string; start?: boolean }) {
  const points = start ? `${cut},0 ${width},0 ${width},${height} 0,${height}` : `${cut},0 ${width},0 ${width - cut},${height} 0,${height}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", left: 0, top: 0 }}>
      <polygon points={points} fill={color} />
    </svg>
  );
}

export default async function OpengraphImage() {
  const font = (f: string) => readFile(join(process.cwd(), "assets/fonts", f));
  const [display, regular, bold] = await Promise.all([font("BricolageGrotesque-CondensedExtraBold.ttf"), font("AtkinsonHyperlegibleNext-Regular.ttf"), font("AtkinsonHyperlegibleNext-Bold.ttf")]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: BLUE, color: "white", fontFamily: "Atkinson" }}>
        {/* A yellow slab cropped by the right and bottom edges, holding a real piece of the dyslexia version. */}
        <div style={{ position: "absolute", right: 0, bottom: 0, width: 560, height: 470, display: "flex" }}>
          <Chisel width={560} height={470} cut={150} color={YELLOW} start />
        </div>
        <div style={{ position: "absolute", left: 650, top: 196, width: 490, height: 434, display: "flex", flexDirection: "column", background: PAPER, color: NAVY, padding: "28px 32px" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#4a5578" }}>The dyslexia version · one idea at a time</div>
          <div style={{ marginTop: 14, fontSize: 25, fontWeight: 700 }}>Where energy comes from</div>
          <div style={{ display: "flex", marginTop: 14, padding: "12px 16px", background: "#dcf2ff", fontSize: 21, fontWeight: 700, lineHeight: 1.4 }}>Photosynthesis turns light energy into food energy.</div>
          <div style={{ marginTop: 14, fontSize: 21, lineHeight: 1.5 }}>Every living thing needs energy. In almost every ecosystem on Earth, that energy starts with photosynthesis.</div>
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: 20 }}>
            {NEEDS.map(([label, color]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", marginRight: 20, marginBottom: 6, fontSize: 18, fontWeight: 700 }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: color, marginRight: 8 }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640, padding: "60px 0 64px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", fontFamily: "Bricolage", fontSize: 44 }}>
            Adapt
            <div style={{ position: "relative", display: "flex", width: 74, height: 50, marginLeft: 4 }}>
              <Chisel width={74} height={50} cut={10} color={YELLOW} />
              <div style={{ position: "absolute", left: 0, top: 0, width: 74, height: 50, display: "flex", alignItems: "center", justifyContent: "center", color: NAVY }}>ED</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Bricolage", fontSize: 116, lineHeight: 0.9, letterSpacing: -2 }}>
            <span>One lesson.</span>
            <span>Every learner.</span>
          </div>
          <div style={{ maxWidth: 520, fontSize: 28, lineHeight: 1.35, color: "rgba(255,255,255,0.88)" }}>Adapt any assignment for the student in front of you. Same learning goals.</div>
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
