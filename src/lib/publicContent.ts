import { CMS_API_BASE, cmsList } from "@/lib/cmsApi";
import { servicesData, type Service } from "@/data/services";
import { projectsData, type Project } from "@/data/projects";
import { blogPosts, type BlogPost } from "@/data/blog";
import {
  serviceFromApi,
  projectFromApi,
  blogFromApi,
  careerFromApi,
  testimonialFromApi,
  pricingFromApi,
} from "@/lib/cmsMappers";
import type {
  CareerPosition,
  TestimonialItem,
  SiteSettings,
  PricingPlan,
} from "@/types/admin";
import { pricingData } from "@/data/pricing";

export async function fetchPublicServices(): Promise<Service[]> {
  try {
    const { data } = await cmsList<Record<string, unknown>>(
      "/public/services",
      { limit: 50 },
      false
    );
    if (data?.length) return data.map(serviceFromApi);
  } catch {
    /* seed */
  }
  return servicesData;
}

export async function fetchPublicProjects(): Promise<Project[]> {
  try {
    const { data } = await cmsList<Record<string, unknown>>(
      "/public/projects",
      { limit: 50 },
      false
    );
    if (data?.length) return data.map(projectFromApi);
  } catch {
    /* seed */
  }
  return projectsData;
}

export async function fetchPublicBlog(): Promise<BlogPost[]> {
  try {
    const { data } = await cmsList<Record<string, unknown>>(
      "/public/blog",
      { limit: 50 },
      false
    );
    if (data?.length) return data.map(blogFromApi);
  } catch {
    /* seed */
  }
  return blogPosts;
}

export async function fetchPublicCareers(): Promise<CareerPosition[]> {
  try {
    const { data } = await cmsList<Record<string, unknown>>(
      "/public/careers",
      { limit: 50, sortBy: "created_at", sortOrder: "desc" },
      false
    );
    if (data?.length) return data.map(careerFromApi);
  } catch {
    /* seed */
  }
  return [];
}

export async function fetchPublicPricing(): Promise<PricingPlan[]> {
  try {
    const { data } = await cmsList<Record<string, unknown>>(
      "/public/pricing-plans",
      { limit: 50, sortBy: "display_order", sortOrder: "asc" },
      false
    );
    if (data?.length) return data.map(pricingFromApi);
  } catch {
    /* seed */
  }
  return pricingData;
}

export async function fetchPublicTestimonials(): Promise<TestimonialItem[]> {
  const { testimonialsData } = await import("@/data/testimonials");
  try {
    const { data } = await cmsList<Record<string, unknown>>(
      "/public/testimonials",
      { limit: 50 },
      false
    );
    if (data?.length) return data.map(testimonialFromApi);
  } catch {
    /* seed */
  }
  return testimonialsData;
}

export async function fetchPublicSettings(): Promise<SiteSettings | null> {
  const { getSiteSettings } = await import("@/lib/siteSettings");
  try {
    return await getSiteSettings();
  } catch {
    return null;
  }
}

export interface PublicOrderMetadata {
  source?: "service_page" | "pricing_page" | "contact_page";
  service_slug?: string;
  service_name?: string;
  pricing_plan?: string;
}

export async function submitPublicOrder(payload: {
  client_name: string;
  client_email: string;
  client_company?: string;
  project_type?: string;
  budget?: string;
  details?: string;
  metadata?: PublicOrderMetadata;
}) {
  let res: Response;
  try {
    res = await fetch(`${CMS_API_BASE}/public/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Cannot reach CMS API. Start backend with: cd backend && npm run dev"
    );
  }

  let json: { success?: boolean; message?: string; data?: unknown };
  try {
    json = await res.json();
  } catch {
    throw new Error(`CMS API returned invalid response (${res.status})`);
  }

  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Failed to submit inquiry (${res.status})`);
  }
  return json.data;
}

export async function submitPublicContact(payload: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
}) {
  const res = await fetch(`${CMS_API_BASE}/public/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Failed to submit");
  }
  return json.data;
}

export async function uploadApplicationCv(file: File) {
  const form = new FormData();
  form.append("cv", file);
  let res: Response;
  try {
    res = await fetch(`${CMS_API_BASE}/public/applications/cv`, {
      method: "POST",
      body: form,
      credentials: "same-origin",
    });
  } catch {
    throw new Error(
      "Cannot reach CMS API. Start backend with: cd backend && npm run dev"
    );
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.message || `CV upload failed (${res.status})`);
  }
  return json.data as { url: string; filename: string; id?: string };
}

export async function submitPublicApplication(payload: {
  career_id?: string | null;
  career_title: string;
  applicant_name: string;
  applicant_email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  portfolio_url?: string;
  github_url?: string;
  linkedin_url?: string;
  years_experience?: string;
  current_position?: string;
  current_salary?: string;
  expected_salary?: string;
  notice_period?: string;
  cover_note?: string;
  cv_url?: string;
  cv_filename?: string;
}) {
  let res: Response;
  try {
    res = await fetch(`${CMS_API_BASE}/public/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        ...payload,
        career_id: payload.career_id || null,
      }),
    });
  } catch {
    throw new Error(
      "Cannot reach CMS API. Start backend with: cd backend && npm run dev"
    );
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Failed to submit application (${res.status})`);
  }
  return json.data;
}

export async function submitPublicReview(payload: {
  client_name: string;
  company?: string;
  position?: string;
  review: string;
  rating?: number;
}) {
  let res: Response;
  try {
    res = await fetch(`${CMS_API_BASE}/public/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Cannot reach CMS API. Start backend with: cd backend && npm run dev"
    );
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Failed to submit review (${res.status})`);
  }
  return json.data;
}
