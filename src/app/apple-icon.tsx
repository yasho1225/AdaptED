import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Same mark as icon.svg: a worksheet with one line on a highlighter's chisel stroke. */
export default function AppleIcon() {
  const line = (w: number, color: string) => <div style={{ width: w, height: 17, background: color }} />;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#0e2fa3", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, padding: "0 34px" }}>
        {line(101, "rgba(255,255,255,0.9)")}
        <div style={{ position: "relative", display: "flex", alignItems: "center", width: 124, height: 35, margin: "0 -11px", padding: "0 13px" }}>
          <svg width="124" height="35" viewBox="0 0 124 35" style={{ position: "absolute", left: 0, top: 0 }}>
            <polygon points="14,0 124,0 110,35 0,35" fill="#ffd43b" />
          </svg>
          {line(68, "#0a1b52")}
        </div>
        {line(62, "rgba(255,255,255,0.9)")}
      </div>
    ),
    size,
  );
}
