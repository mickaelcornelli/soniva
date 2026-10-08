export type TextPart = { type: "text"; value: string } | { type: "link"; value: string };

// URL http(s) jusqu'au prochain espace ; la ponctuation finale (point, virgule, parenthèse
// fermante…) est exclue pour ne pas casser « voir https://exemple.com. »
const URL_PATTERN = /https?:\/\/[^\s<>"]+[^\s<>".,;:!?)\]}'»]/g;

/** Découpe un texte libre en segments texte / lien, sans HTML (aucun risque d'injection). */
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
