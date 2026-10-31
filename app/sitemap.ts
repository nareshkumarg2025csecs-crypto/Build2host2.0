import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/websites",
    "/websites/enquiry",
    "/automation",
    "/automation/enquiry",
    "/catalog",
    "/about",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : route.includes("enquiry") ? 0.9 : 0.8,
  }));
}

