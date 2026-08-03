import {
  fetchPublicProjects,
  fetchPublicServices,
  fetchPublicPricing,
  fetchPublicCareers,
} from "@/lib/publicContent";
import { getSiteSettings } from "@/lib/siteSettings";

/** Compact site facts for the portfolio chatbot (server-only). */
export async function buildChatbotKnowledge(): Promise<string> {
  const [settings, projects, services, pricing, careers] = await Promise.all([
    getSiteSettings(),
    fetchPublicProjects(),
    fetchPublicServices(),
    fetchPublicPricing(),
    fetchPublicCareers(),
  ]);

  const projectLines = projects
    .slice(0, 20)
    .map((p) => {
      const tech = p.technologies?.slice(0, 8).join(", ") || "";
      return `- ${p.title} (${p.category}, ${p.year}): ${p.tagline}. Client: ${p.client}. ${p.description.slice(0, 220)}${tech ? ` Tech: ${tech}.` : ""}`;
    })
    .join("\n");

  const serviceLines = services
    .slice(0, 15)
    .map((s) => {
      const features = s.features?.slice(0, 4).join("; ") || "";
      return `- ${s.title}: ${s.subtitle}. ${s.description.slice(0, 180)} Features: ${features}. From ${s.basePrice}, ~${s.estimatedWeeks}.`;
    })
    .join("\n");

  const pricingLines = pricing
    .slice(0, 10)
    .map((p) => `- ${p.title}: ${p.price} — ${(p.description || p.subtitle || "").slice(0, 120)}`)
    .join("\n");

  const careerLines = careers
    .slice(0, 10)
    .map((c) => `- ${c.title}${c.location ? ` (${c.location})` : ""}${c.type ? ` — ${c.type}` : ""}`)
    .join("\n");

  return `
COMPANY
- Name: ${settings.companyName}
- Email: ${settings.contactEmail}
- Phone: ${settings.contactPhone}
- Address: ${settings.address}
- About: ${settings.metaDescription}
- Website topics: portfolio/projects, services, pricing, process, careers, blog, contact, about Kodraxelsoft

PORTFOLIO / PROJECTS
${projectLines || "- (none listed)"}

SERVICES
${serviceLines || "- (none listed)"}

PRICING PLANS
${pricingLines || "- Contact for custom quotes"}

CAREERS
${careerLines || "- No open roles listed right now; ask visitors to contact us"}

CONTACT CTA
- Prefer directing serious inquiries to email ${settings.contactEmail} or phone ${settings.contactPhone}, or the Contact page on this site.
`.trim();
}
