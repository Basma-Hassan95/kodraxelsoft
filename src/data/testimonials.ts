import type { TestimonialItem } from "@/types/admin";

/** Fallback reviews when CMS is unreachable or empty — homepage always shows this section. */
export const testimonialsData: TestimonialItem[] = [
  {
    id: "seed-1",
    clientName: "Sarah M.",
    role: "Operations Manager",
    company: "",
    review:
      "Kodraxelsoft built us an automated system that saves our staff over 15 hours every single week. Best investment we've made.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    isApproved: true,
    isEnabled: true,
  },
  {
    id: "seed-2",
    clientName: "David K.",
    role: "Business Founder",
    company: "",
    review:
      "They spoke plain English and explained everything clearly. Our new web platform works perfectly and customer sales went up by 30%.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    isApproved: true,
    isEnabled: true,
  },
  {
    id: "seed-3",
    clientName: "Elena Voss",
    role: "Founder",
    company: "Lumen Retail",
    review:
      "Our new site feels clean and fast. Customers find what they need quicker — and we spend less time explaining our tools to the team.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    isApproved: true,
    isEnabled: true,
  },
];
