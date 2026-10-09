export type TextPart = { type: "text"; value: string } | { type: "link"; value: string };

// http(s) URL up to the next space; trailing punctuation
// is excluded so "see https://example.com." doesn't break.
const URL_PATTERN = /https?:\/\/[^\s<>"]+[^\s<>".,;:!?)\]}'»]/g;

/** Text/link segments without HTML, so no injection risk. */
export function splitLinks(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let cursor = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index;
    if (start > cursor) parts.push({ type: "text", value: text.slice(cursor, start) });
    parts.push({ type: "link", value: match[0] });
    cursor = start + match[0].length;
  }
  if (cursor < text.length) parts.push({ type: "text", value: text.slice(cursor) });

  return parts;
}
