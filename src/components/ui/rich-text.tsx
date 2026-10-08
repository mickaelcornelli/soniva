import { splitLinks } from "@/lib/linkify";

interface RichTextProps {
  text: string;
  className?: string;
}

/** Texte libre d'un artiste (description, bio) : sauts de ligne conservés, URL cliquables. */
export function RichText({ text, className = "" }: RichTextProps) {
  return (
    <p className={`whitespace-pre-line text-muted ${className}`}>
      {splitLinks(text).map((part, index) =>
        part.type === "link" ? (
          <a
            key={index}
            href={part.value}
            target="_blank"
            // Contenu fourni par des tiers : pas de transmission de crédit SEO ni d'accès à la page.
            rel="noopener noreferrer nofollow ugc"
            className="break-all text-foreground underline underline-offset-4 hover:text-accent"
          >
            {part.value}
          </a>
        ) : (
          part.value
        ),
      )}
    </p>
  );
}
