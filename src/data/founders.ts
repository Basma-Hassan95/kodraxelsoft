export interface Founder {
  id: string;
  name: string;
  role: string;
  tagline: string;
  bio: string;
  expertise: string[];
  image: string;
  stats: { label: string; value: string }[];
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email: string;
  };
}

export const foundersData: Founder[] = [
  {
    id: "founder-1",
    name: "Alexandre Vance",
    role: "CEO & Chief Software Architect",
    tagline: "Former Principal Architect at Stripe & AWS Cloud Systems.",
    bio: "Pioneering distributed cloud infrastructure and ultra-low latency backend architectures. Alexandre leads Kodraxelsoft's strategic direction and high-scale system design.",
    expertise: ["Distributed Systems", "Cloud Native", "Next.js Core", "System Security"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    stats: [
      { label: "Systems Built", value: "140+" },
      { label: "Uptime SLA", value: "99.999%" }
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "alexandre@kodraxelsoft.com"
    }
  },
  {
    id: "founder-2",
    name: "Elena Rostova",
    role: "Lead Creative Director & Frontend Lead",
    tagline: "Award-winning Creative Engineer specializing in WebGL & GSAP.",
    bio: "Crafting fluid interactive experiences, micro-interactions, and visual storytelling engines that convert visitors into enterprise clients. Elena bridges art and algorithms.",
    expertise: ["Creative Design", "GSAP & WebGL", "UI/UX Architecture", "Design Systems"],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
    stats: [
      { label: "Design Awards", value: "18" },
      { label: "Animation Speed", value: "60 FPS" }
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "elena@kodraxelsoft.com"
    }
  },
  {
    id: "founder-3",
    name: "Dr. Marcus Chen",
    role: "Head of AI & Machine Learning",
    tagline: "Ph.D. in Deep Learning, Stanford University AI Lab Alum.",
    bio: "Architecting custom LLM pipelines, autonomous agentic workflows, and real-time computer vision models that automate complex enterprise operations.",
    expertise: ["PyTorch & CUDA", "Autonomous Agents", "Custom LLMs", "Predictive Analytics"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    stats: [
      { label: "AI Models Deployed", value: "45+" },
      { label: "Inference Latency", value: "<15ms" }
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "marcus@kodraxelsoft.com"
    }
  },
  {
    id: "founder-4",
    name: "Sophia Sterling",
    role: "Director of Product & Enterprise Growth",
    tagline: "Scaled 3 B2B Tech Startups to Series B & Beyond.",
    bio: "Ensuring zero-friction onboarding, transparent project milestones, agile delivery timelines, and measurable ROI for global corporate partners.",
    expertise: ["Product Strategy", "Agile Leadership", "Enterprise Growth", "Client SLA Management"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    stats: [
      { label: "Client ROI Avg", value: "3.8x" },
      { label: "On-Time Delivery", value: "100%" }
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "sophia@kodraxelsoft.com"
    }
  }
];
