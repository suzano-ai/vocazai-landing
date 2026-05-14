/**
 * Renders a JSON-LD <script> for structured data (schema.org). Google reads
 * this for rich results — Organization, FAQ, Service, etc.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; no user input flows in here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
