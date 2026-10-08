/**
 * Données structurées schema.org. Les `<` sont échappés pour qu'un titre
 * contenant « </script> » ne puisse pas fermer la balise prématurément.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
