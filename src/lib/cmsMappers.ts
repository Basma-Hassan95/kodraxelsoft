import type { Service } from "@/data/services";
import type { Project } from "@/data/projects";
import type { BlogPost } from "@/data/blog";
import type {
  LeadInquiry,
  CareerPosition,
  TestimonialItem,
  MediaAsset,
  SiteSettings,
} from "@/types/admin";

/* ---------- Services ---------- */
export function serviceFromApi(row: Record<string, unknown>): Service {
  return {
    id: String(row.id),
    iconName: String(row.icon || "Code"),
    title: String(row.title || ""),
    subtitle: String(row.subtitle || ""),
    description: String(row.description || ""),
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    deliverables: Array.isArray(row.deliverables)
      ? (row.deliverables as string[])
      : [],
    basePrice: String(row.base_price || ""),
    estimatedWeeks: String(row.estimated_weeks || ""),
    technologies: Array.isArray(row.technologies)
      ? (row.technologies as string[])
      : [],
  };
}

export function serviceToApi(s: Service) {
  return {
    title: s.title,
    subtitle: s.subtitle,
    description: s.description,
    icon: s.iconName,
    features: s.features || [],
    deliverables: s.deliverables || [],
    technologies: s.technologies || [],
    base_price: s.basePrice,
    estimated_weeks: s.estimatedWeeks,
    button_text: "Learn More",
    button_link: "/contact",
    is_enabled: true,
  };
}

/* ---------- Projects ---------- */
export function projectFromApi(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    title: String(row.name || row.title || ""),
    category: (row.category as Project["category"]) || "SaaS & Web Apps",
    client: String(row.client_name || ""),
    tagline: String(row.tagline || ""),
    description: String(row.description || ""),
    challenge: String(row.challenge || ""),
    solution: String(row.solution || ""),
    impactMetrics: Array.isArray(row.impact_metrics)
      ? (row.impact_metrics as Project["impactMetrics"])
      : [],
    technologies: Array.isArray(row.technologies)
      ? (row.technologies as string[])
      : [],
    image: String(row.cover_image || (Array.isArray(row.images) ? row.images[0] : "") || ""),
    year: String(row.year || ""),
    featured: Boolean(row.is_featured),
    demoUrl: row.live_url ? String(row.live_url) : undefined,
  };
}

export function projectToApi(p: Project) {
  return {
    name: p.title,
    category: p.category,
    client_name: p.client,
    tagline: p.tagline,
    description: p.description,
    challenge: p.challenge,
    solution: p.solution,
    impact_metrics: p.impactMetrics || [],
    technologies: p.technologies || [],
    cover_image: p.image,
    images: p.image ? [p.image] : [],
    year: p.year,
    is_featured: p.featured,
    live_url: p.demoUrl || null,
    status: "published",
  };
}

/* ---------- Blog ---------- */
export function blogFromApi(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id),
    slug: String(row.slug || ""),
    title: String(row.title || ""),
    excerpt: String(row.excerpt || ""),
    category: (row.category as BlogPost["category"]) || "Web Architecture",
    author: {
      name: String(row.author_name || "Kodraxelsoft"),
      role: String(row.author_role || "Editor"),
      avatar: String(row.author_avatar || ""),
    },
    publishedDate: row.published_date
      ? String(row.published_date)
      : String(row.created_at || ""),
    readTime: String(row.read_time || "5 Min Read"),
    image: String(row.image_url || ""),
    featured: Boolean(row.is_featured),
    content: Array.isArray(row.content) ? (row.content as string[]) : [],
  };
}

export function blogToApi(b: BlogPost) {
  return {
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    category: b.category,
    author_name: b.author?.name,
    author_role: b.author?.role,
    author_avatar: b.author?.avatar,
    published_date: b.publishedDate || null,
    read_time: b.readTime,
    image_url: b.image,
    content: b.content || [],
    is_featured: b.featured,
    is_published: true,
  };
}

/* ---------- Leads ↔ Orders ---------- */
const leadStatusToOrder: Record<LeadInquiry["status"], string> = {
  New: "pending",
  Contacted: "in_progress",
  "In Progress": "in_progress",
  "Closed Won": "completed",
  Archived: "cancelled",
};

const orderStatusToLead: Record<string, LeadInquiry["status"]> = {
  pending: "New",
  in_progress: "In Progress",
  completed: "Closed Won",
  delivered: "Closed Won",
  cancelled: "Archived",
};

export function leadFromOrder(row: Record<string, unknown>): LeadInquiry {
  return {
    id: String(row.id),
    clientName: String(row.client_name || ""),
    clientEmail: String(row.client_email || ""),
    clientCompany: String(row.client_company || ""),
    projectType: String(row.project_type || ""),
    selectedBudget: String(row.budget || ""),
    projectDetails: String(row.details || ""),
    status: orderStatusToLead[String(row.status)] || "New",
    createdAt: String(row.created_at || "").replace("T", " ").slice(0, 16),
  };
}

export function leadStatusToApi(status: LeadInquiry["status"]) {
  return leadStatusToOrder[status] || "pending";
}

/* ---------- Careers ---------- */
export function careerFromApi(row: Record<string, unknown>): CareerPosition {
  return {
    id: String(row.id),
    title: String(row.title || ""),
    department: String(row.department || ""),
    type: String(row.type || "Full-Time"),
    location: String(row.location || ""),
    salary: String(row.salary || ""),
    description: String(row.description || ""),
    requirements: Array.isArray(row.requirements)
      ? (row.requirements as string[])
      : [],
    active: row.is_active !== false,
  };
}

export function careerToApi(c: CareerPosition) {
  return {
    title: c.title,
    department: c.department,
    type: c.type,
    location: c.location,
    salary: c.salary,
    description: c.description,
    requirements: c.requirements || [],
    is_active: c.active,
  };
}

/* ---------- Testimonials ---------- */
export function testimonialFromApi(row: Record<string, unknown>): TestimonialItem {
  return {
    id: String(row.id),
    clientName: String(row.client_name || ""),
    role: String(row.position || ""),
    company: String(row.company || ""),
    review: String(row.review || ""),
    rating: Number(row.rating || 5),
    avatar: String(row.profile_image || ""),
    isApproved: row.is_approved !== false,
    isEnabled: row.is_enabled !== false,
    source: String(row.source || "admin"),
  };
}

export function testimonialToApi(t: TestimonialItem) {
  return {
    client_name: t.clientName,
    position: t.role,
    company: t.company,
    review: t.review,
    rating: t.rating,
    profile_image: t.avatar,
    is_enabled: true,
    is_approved: true,
    source: "admin",
  };
}

/* ---------- Media ---------- */
export function mediaFromApi(row: Record<string, unknown>): MediaAsset {
  const bytes = Number(row.size_bytes || 0);
  const size =
    bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return {
    id: String(row.id),
    filename: String(row.original_name || row.filename || ""),
    url: String(row.url || ""),
    size,
    type: String(row.media_type) === "video" ? "video" : "image",
    uploadedAt: String(row.created_at || "").slice(0, 10),
  };
}

/* ---------- Settings ---------- */
export function settingsFromApi(row: Record<string, unknown> | null): SiteSettings | null {
  if (!row) return null;
  const social = (row.social_links || {}) as Record<string, string>;
  const seo = (row.seo_defaults || {}) as Record<string, string>;
  return {
    companyName: String(row.company_name || ""),
    contactEmail: String(row.email || ""),
    contactPhone: String(row.phone || ""),
    address: String(row.address || ""),
    githubUrl: String(social.github || ""),
    linkedinUrl: String(social.linkedin || ""),
    twitterUrl: String(social.twitter || ""),
    metaTitle: String(seo.metaTitle || ""),
    metaDescription: String(seo.metaDescription || ""),
    keywords: String(seo.keywords || ""),
    ogImageUrl: String(seo.ogImageUrl || row.logo_url || ""),
  };
}

export function settingsToApi(s: SiteSettings) {
  return {
    company_name: s.companyName,
    email: s.contactEmail,
    phone: s.contactPhone,
    address: s.address,
    logo_url: s.ogImageUrl,
    social_links: {
      github: s.githubUrl,
      linkedin: s.linkedinUrl,
      twitter: s.twitterUrl,
    },
    seo_defaults: {
      metaTitle: s.metaTitle,
      metaDescription: s.metaDescription,
      keywords: s.keywords,
      ogImageUrl: s.ogImageUrl,
    },
  };
}
