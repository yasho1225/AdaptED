import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Same mark as icon.svg: a worksheet with one line highlighted. */
export default function AppleIcon() {
  const line = (w: number, color: string) => <div style={{ width: w, height: 17, borderRadius: 9, background: color }} />;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#1e40af", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, padding: "0 34px" }}>
        {line(101, "rgba(255,255,255,0.9)")}
        <div style={{ display: "flex", alignItems: "center", margin: "0 -11px", padding: "9px 11px", borderRadius: 8, background: "#ffd43b" }}>{line(73, "#0f1f5c")}</div>
        {line(62, "rgba(255,255,255,0.9)")}
      </div>
    ),
    size,
  );
}
