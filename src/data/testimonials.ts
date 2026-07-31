import type { TestimonialItem } from "@/types/admin";

/** Fallback reviews when CMS is unreachable or empty — homepage always shows this section. */
export const testimonialsData: TestimonialItem[] = [
  {
    id: "seed-1",
    clientName: "Marcus Thorne",
    role: "VP of Engineering",
    company: "Velox Global Capital",
    review:
      "Kodraxelsoft engineered our high-frequency trading portal in 5 weeks. UI rendering latency dropped by 85%.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    isApproved: true,
    isEnabled: true,
  },
  {
    id: "seed-2",
    clientName: "Priya Nair",
    role: "Chief Product Officer",
    company: "Northstar Health",
    review:
      "Their AI intake workflow cut patient wait times in half. Clean delivery, clear milestones, zero drama.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    isApproved: true,
    isEnabled: true,
  },
  {
    id: "seed-3",
    clientName: "Elena Voss",
    role: "Founder",
    company: "Lumen Retail",
    review:
      "The headless storefront they shipped feels premium and fast. Conversion jumped within the first sprint.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    isApproved: true,
    isEnabled: true,
  },
];
