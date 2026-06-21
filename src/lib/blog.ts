// Blog data, reads MDX posts from content/blog with gray-matter. Server-only
// (uses node fs); imported by the /blog pages and generateStaticParams.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  /** ISO date (yyyy-mm-dd). */
  date: string;
  /** Pretty date, e.g. "Jun 19, 2026". */
  dateLabel: string;
  tags: string[];
  excerpt: string;
  read: string;
}

export interface Post extends PostMeta {
  content: string;
}

function dateLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function toMeta(slug: string, data: Record<string, unknown>): PostMeta {
  const date = typeof data.date === "string" ? data.date : "";
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    date,
    dateLabel: dateLabel(date),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    read: typeof data.read === "string" ? data.read : "",
  };
}

export function getAllPosts(): PostMeta[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
      const { data } = matter(raw);
      return toMeta(slug, data);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return { ...toMeta(slug, data), content };
}

/** The fixed filter set shown on /blog (matches the reference design). */
export const blogFilters = ["All", "n8n", "Trigger.dev", "LangChain", "Node.js"];
