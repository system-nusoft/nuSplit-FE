import type { MetadataRoute } from "next";

const SITE_URL = "https://spliit.nusoft.co";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/groups", "/account", "/onboarding", "/invite"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
