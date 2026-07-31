import type {
  CareerPosition,
  LeadInquiry,
  MediaAsset,
  TestimonialItem,
} from "@/types/admin";
import type { Service } from "@/data/services";
import type { Project } from "@/data/projects";
import type { BlogPost } from "@/data/blog";
import { adminMenuItems } from "@/components/admin/AdminSidebar";

export type AdminSearchResult = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category: string;
};

function matches(q: string, ...parts: Array<string | undefined | null>) {
  const hay = parts.filter(Boolean).join(" ").toLowerCase();
  return hay.includes(q);
}

export function searchAdminCms(opts: {
  query: string;
  services: Service[];
  projects: Project[];
  blogPosts: BlogPost[];
  leads: LeadInquiry[];
  careers: CareerPosition[];
  testimonials: TestimonialItem[];
  mediaAssets: MediaAsset[];
  limit?: number;
}): AdminSearchResult[] {
  const q = opts.query.trim().toLowerCase();
  if (q.length < 1) return [];
  const limit = opts.limit ?? 24;
  const results: AdminSearchResult[] = [];

  for (const item of adminMenuItems) {
    if (matches(q, item.name, item.href)) {
      results.push({
        id: `page-${item.href}`,
        title: item.name,
        subtitle: "Admin page",
        href: item.href,
        category: "Pages",
      });
    }
  }

  for (const s of opts.services) {
    if (matches(q, s.title, s.subtitle, s.description, ...(s.technologies || []))) {
      results.push({
        id: `svc-${s.id}`,
        title: s.title,
        subtitle: s.subtitle || "Service",
        href: "/admin/services",
        category: "Services",
      });
    }
  }

  for (const p of opts.projects) {
    if (matches(q, p.title, p.client, p.category, p.tagline, p.description)) {
      results.push({
        id: `proj-${p.id}`,
        title: p.title,
        subtitle: `${p.client} · ${p.category}`,
        href: "/admin/portfolio",
        category: "Case Studies",
      });
    }
  }

  for (const b of opts.blogPosts) {
    if (matches(q, b.title, b.excerpt, b.category, b.slug, b.author?.name)) {
      results.push({
        id: `blog-${b.id}`,
        title: b.title,
        subtitle: `${b.category} · ${b.author?.name || "Author"}`,
        href: "/admin/blog",
        category: "Blog",
      });
    }
  }

  for (const l of opts.leads) {
    if (
      matches(
        q,
        l.clientName,
        l.clientEmail,
        l.clientCompany,
        l.projectType,
        l.selectedBudget,
        l.projectDetails,
        l.status
      )
    ) {
      results.push({
        id: `lead-${l.id}`,
        title: l.clientName,
        subtitle: `${l.clientEmail} · ${l.projectType || "Lead"} · ${l.status}`,
        href: "/admin/leads",
        category: "Leads",
      });
    }
  }

  for (const c of opts.careers) {
    if (matches(q, c.title, c.department, c.location, c.type, c.description)) {
      results.push({
        id: `career-${c.id}`,
        title: c.title,
        subtitle: `${c.department} · ${c.location}`,
        href: "/admin/careers",
        category: "Careers",
      });
    }
  }

  for (const t of opts.testimonials) {
    if (matches(q, t.clientName, t.company, t.role, t.review)) {
      results.push({
        id: `rev-${t.id}`,
        title: t.clientName,
        subtitle: `${t.company || "Client"} · Review`,
        href: "/admin/testimonials",
        category: "Testimonials",
      });
    }
  }

  for (const m of opts.mediaAssets) {
    if (matches(q, m.filename, m.url, m.type)) {
      results.push({
        id: `media-${m.id}`,
        title: m.filename,
        subtitle: `${m.type} · Media`,
        href: "/admin/media",
        category: "Media",
      });
    }
  }

  return results.slice(0, limit);
}
