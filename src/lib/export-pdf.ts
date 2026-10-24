"use client";

import type { jsPDF as JsPDF } from "jspdf";
import type { AdaptedAssignment, AdaptResult, Block, NeedId } from "@/lib/adapt/types";
import { NEEDS } from "@/lib/adapt/profile";
import { getResearch } from "@/lib/adapt/research";

/**
 * Printable PDF of the adapted assignment (student pages) plus an optional
 * teacher page. Dyslexia profiles get larger type, wider line spacing and a
 * cream page, following the BDA style guide.
 */

const NEED_RGB: Record<NeedId, [number, number, number]> = {
  dyslexia: [30, 100, 170],
  adhd: [176, 82, 20],
  apd: [20, 120, 95],
  autism: [120, 60, 160],
};

interface Ctx {
  doc: JsPDF;
  y: number;
  margin: number;
  width: number;
  pageH: number;
  size: number;
  lead: number;
  accent: [number, number, number];
  cream: boolean;
}

function newPage(c: Ctx) {
  c.doc.addPage();
  paintPage(c);
  c.y = c.margin;
}

function paintPage(c: Ctx) {
  if (!c.cream) return;
  const w = c.doc.internal.pageSize.getWidth();
  c.doc.setFillColor(253, 248, 232);
  c.doc.rect(0, 0, w, c.pageH, "F");
}

function ensure(c: Ctx, h: number) {
  if (c.y + h > c.pageH - c.margin) newPage(c);
}

/** Standard PDF fonts only cover Latin-1 (WinAnsi); swap the few symbols we use that fall outside it. */
function pdfSafe(text: string): string {
  return text
    .replace(/○/g, "( )")
    .replace(/[→⟶]/g, "->")
    .replace(/[★☆]/g, "*")
    .replace(/≈/g, "~")
    .replace(/[✓✔]/g, "v")
    .replace(/[☐□]/g, "[ ]")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/₂/g, "2");
}

/** Draw text with **bold** segments, wrapping by measured word widths. */
function rich(c: Ctx, text: string, opts: { x?: number; width?: number; size?: number; bold?: boolean; color?: [number, number, number] } = {}) {
  const { doc } = c;
  const x0 = opts.x ?? c.margin;
  const maxW = opts.width ?? c.width - (x0 - c.margin);
  const size = opts.size ?? c.size;
  const lineH = size * 0.3528 * c.lead;
  doc.setFontSize(size);
  doc.setTextColor(...(opts.color ?? [30, 34, 48]));

  const paragraphs = pdfSafe(text).split("\n");
  for (const para of paragraphs) {
    const tokens: { word: string; bold: boolean }[] = [];
    para.split(/(\*\*[^*]+\*\*)/g).forEach((seg) => {
      const isBold = seg.startsWith("**") && seg.endsWith("**");
      const raw = isBold ? seg.slice(2, -2) : seg;
      raw.split(/(\s+)/).forEach((w) => w && tokens.push({ word: w, bold: isBold || !!opts.bold }));
    });
    let x = x0;
    ensure(c, lineH);
    for (const t of tokens) {
      doc.setFont("helvetica", t.bold ? "bold" : "normal");
      const w = doc.getTextWidth(t.word);
      if (/^\s+$/.test(t.word)) {
        if (x > x0) x += w;
        continue;
      }
      if (x + w > x0 + maxW && x > x0) {
        c.y += lineH;
        ensure(c, lineH);
        x = x0;
      }
      doc.text(t.word, x, c.y + size * 0.3528);
      x += w;
    }
    c.y += lineH;
  }
}

function heading(c: Ctx, text: string, size: number) {
  ensure(c, size * 0.9);
  c.y += 2;
  rich(c, text, { size, bold: true });
  c.y += 1.5;
}

function box(c: Ctx, x: number, y: number) {
  c.doc.setDrawColor(...c.accent);
  c.doc.setLineWidth(0.4);
  c.doc.rect(x, y, 4, 4);
}

function block(c: Ctx, b: Block, dirNo: number) {
  const muted: [number, number, number] = [80, 86, 104];
  switch (b.type) {
    case "text":
      rich(c, b.text ?? "");
      c.y += 2;
      break;
    case "keyIdea":
      rich(c, "KEY IDEA", { size: c.size * 0.7, bold: true, color: c.accent });
      rich(c, b.text ?? "", { bold: true });
      c.y += 2;
      break;
    case "tip":
      rich(c, b.text ?? "", { x: c.margin + 6, size: c.size * 0.9, color: muted });
      c.y += 1;
      break;
    case "vocab":
      rich(c, `${b.term}${b.syllables && b.syllables !== b.term ? `  (${b.syllables.replace(/·/g, " · ")})` : ""}`, { bold: true });
      if (b.definition) rich(c, b.definition, { x: c.margin + 6, color: muted });
      c.y += 1.5;
      break;
    case "direction":
      rich(c, `${dirNo}.  ${b.text ?? ""}`);
      c.y += 1;
      break;
    case "question": {
      ensure(c, 20);
      rich(c, `Question ${b.number ?? ""}`, { size: c.size * 0.75, bold: true, color: c.accent });
      rich(c, b.text ?? "", { bold: true });
      b.items?.forEach((it) => rich(c, `○  ${it}`, { x: c.margin + 6 }));
      const s = b.supports;
      if (s?.length) rich(c, `How much: ${s.length}`, { x: c.margin + 6, size: c.size * 0.9, color: muted });
      s?.steps?.forEach((st, i) => rich(c, `${i + 1}. ${st}`, { x: c.margin + 6, size: c.size * 0.9 }));
      if (s?.starters) rich(c, `Starters: ${s.starters.join("  /  ")}`, { x: c.margin + 6, size: c.size * 0.9, color: muted });
      if (s?.wordBank) rich(c, `Word bank: ${s.wordBank.join(", ")}`, { x: c.margin + 6, size: c.size * 0.9, color: muted });
      if (s?.hint) rich(c, `Hint: ${s.hint}`, { x: c.margin + 6, size: c.size * 0.9, color: muted });
      if (s?.responseOptions) rich(c, `Ways to answer: ${s.responseOptions.join(" · ")}`, { x: c.margin + 6, size: c.size * 0.9, color: muted });
      if (!b.items?.length) {
        const lines = 3;
        const gap = c.size * 0.3528 * 2.1;
        ensure(c, lines * gap + 2);
        c.doc.setDrawColor(190, 186, 170);
        c.doc.setLineWidth(0.2);
        for (let i = 1; i <= lines; i++) c.doc.line(c.margin + 6, c.y + i * gap, c.margin + c.width, c.y + i * gap);
        c.y += lines * gap + 2;
      }
      c.y += 3;
      break;
    }
    case "checklist":
      b.items?.forEach((it) => {
        ensure(c, 7);
        box(c, c.margin, c.y + 0.8);
        rich(c, it, { x: c.margin + 7 });
      });
      c.y += 2;
      break;
    case "expectations":
      b.items?.forEach((it) => rich(c, it));
      c.y += 2;
      break;
    case "example":
      rich(c, "MODEL — A DIFFERENT EXAMPLE", { size: c.size * 0.7, bold: true, color: muted });
      rich(c, b.text ?? "", { bold: true });
      b.items?.forEach((it) => rich(c, it, { color: muted }));
      c.y += 2;
      break;
    case "break":
      rich(c, `Break${b.minutes ? ` (${b.minutes} min)` : ""}: ${b.text ?? ""}`, { bold: true, color: c.accent });
      c.y += 2;
      break;
    case "notes":
      if (b.text) rich(c, b.text, { bold: true, color: c.accent });
      b.items?.forEach((it, i) => rich(c, `${i + 1}. ${it.replace(/____/g, "__________")}`));
      c.y += 2;
      break;
  }
}

function studentPages(c: Ctx, a: AdaptedAssignment) {
  heading(c, a.title, c.size + 7);
  if (a.studentIntro) rich(c, a.studentIntro, { color: [70, 76, 94] });
  if (a.estimatedMinutes) rich(c, `About ${a.estimatedMinutes} minutes`, { bold: true, color: c.accent });
  rich(c, "Name: ______________________    Date: ____________", { size: c.size * 0.9 });
  c.y += 4;
  a.sections.forEach((sec, si) => {
    ensure(c, 18);
    heading(c, `${sec.heading}${sec.minutes ? `  ·  ${sec.minutes} min` : ""}`, c.size + 3);
    if (sec.purpose) rich(c, sec.purpose, { size: c.size * 0.9, color: [80, 86, 104] });
    let dir = 0;
    sec.blocks.forEach((b) => {
      if (b.type === "direction") dir += 1;
      block(c, b, dir);
    });
    if (si < a.sections.length - 1) c.y += 3;
  });
}

function teacherPage(c: Ctx, r: AdaptResult) {
  c.cream = false;
  newPage(c);
  const a = r.assignment;
  heading(c, "Teacher page — what changed and why", 16);
  rich(c, `Profile: ${r.profile.needs.map((n) => NEEDS[n].label).join(" + ")} · ${r.profile.expectations === "accommodate" ? "Accommodation (same learning goals)" : "Modified expectations"}`, { size: 10, color: [80, 86, 104] });
  rich(c, `Questions preserved: ${r.fidelity.matchedQuestions}/${r.fidelity.originalQuestions}${r.fidelity.restored.length ? ` (restored word-for-word: ${r.fidelity.restored.join(", ")})` : ""}`, { size: 10, color: [80, 86, 104] });
  c.y += 3;
  a.changes.forEach((ch, i) => {
    const src = getResearch(ch.evidence);
    rich(c, `${i + 1}. ${ch.title}`, { bold: true, size: 11 });
    rich(c, ch.detail, { size: 10, x: c.margin + 5 });
    if (src) rich(c, `Basis: ${src.citation}`, { size: 8.5, x: c.margin + 5, color: [90, 96, 114] });
    c.y += 1.5;
  });
  if (a.teacherNotes.length) {
    heading(c, "Teacher notes", 13);
    a.teacherNotes.forEach((n) => rich(c, `•  ${n}`, { size: 10 }));
  }
  c.y += 3;
  rich(c, `Made with AdaptED (${r.source === "ai" ? "AI-generated — review before use" : r.source === "curated" ? "pre-built example" : "offline rule-based version"}).`, { size: 8.5, color: [110, 116, 134] });
}

/** Languages whose scripts the built-in PDF fonts cannot draw — use the browser's print-to-PDF instead. */
export const PDF_UNSUPPORTED_LANGUAGES = new Set(["chinese", "arabic", "hindi", "vietnamese"]);

export async function downloadAdaptedPdf(result: AdaptResult, includeTeacherPage = true) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const need = result.profile.needs[0];
  const dyslexia = result.profile.needs.includes("dyslexia");
  const c: Ctx = {
    doc,
    y: 18,
    margin: 18,
    width: doc.internal.pageSize.getWidth() - 36,
    pageH: doc.internal.pageSize.getHeight(),
    size: dyslexia ? 13 : 11.5,
    lead: dyslexia ? 1.65 : 1.45,
    accent: NEED_RGB[need],
    cream: dyslexia,
  };
  paintPage(c);
  studentPages(c, result.assignment);
  if (includeTeacherPage) teacherPage(c, result);
  const slug = result.assignment.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "assignment";
  doc.save(`adapted-${slug}-${result.profile.needs.join("-")}.pdf`);
}

export function assignmentToPlainText(a: AdaptedAssignment): string {
  const out: string[] = [a.title, a.studentIntro, ""];
  a.sections.forEach((s) => {
    out.push(`## ${s.heading}${s.minutes ? ` (${s.minutes} min)` : ""}`);
    if (s.purpose) out.push(s.purpose);
    let dir = 0;
    s.blocks.forEach((b) => {
      const t = (b.text ?? "").replace(/\*\*/g, "");
      switch (b.type) {
        case "vocab":
          out.push(`- ${b.term}${b.syllables ? ` (${b.syllables})` : ""}: ${b.definition ?? ""}`);
          break;
        case "direction":
          dir += 1;
          out.push(`${dir}. ${t}`);
          break;
        case "question":
          out.push(`Question ${b.number}: ${t}`);
          b.items?.forEach((i) => out.push(`   ${i}`));
          if (b.supports?.length) out.push(`   How much: ${b.supports.length}`);
          b.supports?.steps?.forEach((st, i) => out.push(`   ${i + 1}) ${st.replace(/\*\*/g, "")}`));
          if (b.supports?.starters) out.push(`   Starters: ${b.supports.starters.join(" / ")}`);
          if (b.supports?.wordBank) out.push(`   Word bank: ${b.supports.wordBank.join(", ")}`);
          if (b.supports?.hint) out.push(`   Hint: ${b.supports.hint.replace(/\*\*/g, "")}`);
          break;
        case "checklist":
          b.items?.forEach((i) => out.push(`[ ] ${i}`));
          break;
        case "notes":
          if (t) out.push(t);
          b.items?.forEach((i, n) => out.push(`${n + 1}. ${i}`));
          break;
        default:
          if (t) out.push(b.type === "keyIdea" ? `KEY IDEA: ${t}` : t);
          b.items?.forEach((i) => out.push(`   ${i}`));
      }
    });
    out.push("");
  });
  return out.join("\n").trim() + "\n";
}
