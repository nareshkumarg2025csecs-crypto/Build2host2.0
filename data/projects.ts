export interface Project {
  slug: string;
  title: string;
  category: "websites" | "automation";
  year: string;
  summary: string;
  image: string | null;
  href: string | null;
  tags: string[];
}

export const projects: Project[] = [
  {
    slug: "project-01",
    title: "Project title coming soon",
    category: "websites",
    year: "2025",
    summary: "A beautifully crafted website for a growing brand.",
    image: null,
    href: null,
    tags: ["Website", "Design", "SEO"],
  },
  {
    slug: "project-02",
    title: "Project title coming soon",
    category: "automation",
    year: "2025",
    summary: "End-to-end lead capture and qualification automation.",
    image: null,
    href: null,
    tags: ["Automation", "WhatsApp", "Real Estate"],
  },
  {
    slug: "project-03",
    title: "Project title coming soon",
    category: "websites",
    year: "2025",
    summary: "A premium brand presence with advanced interactions.",
    image: null,
    href: null,
    tags: ["Website", "Premium", "Branding"],
  },
];
