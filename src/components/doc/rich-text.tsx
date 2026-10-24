import { Fragment } from "react";

/** Render **bold** markers and line breaks. Nothing else is interpreted (no HTML). */
export function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
            part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
              <strong key={i} className="font-bold text-ink">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <Fragment key={i}>{part}</Fragment>
            ),
          )}
        </Fragment>
      ))}
    </>
  );
}

export function stripMarkers(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, "$1");
}
