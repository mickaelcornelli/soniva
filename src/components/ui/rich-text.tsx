import { splitLinks } from "@/lib/linkify";

interface RichTextProps {
  text: string;
  className?: string;
}

export function RichText({ text, className = "" }: RichTextProps) {
  return (
    <p className={`whitespace-pre-line text-muted ${className}`}>
      {splitLinks(text).map((part, index) =>
        part.type === "link" ? (
          <a
            key={index}
            href={part.value}
            target="_blank"
            // Third-party content: pass no SEO credit and no window access.
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
