/**
 * Resolves the canonical base URL for metadata, Open Graph assets, robots, and sitemap.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    const withProtocol =
      configured.startsWith("http://") || configured.startsWith("https://")
        ? configured
        : `https://${configured}`;
    return withProtocol.replace(/\/$/, "");
  }

  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "https://nuvi-one.vercel.app";
}
