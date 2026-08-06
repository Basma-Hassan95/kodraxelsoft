export interface Project {
  id: string;
  title: string;
  category:
    | "Websites & Apps"
    | "AI & Smart Automation"
    | "Finance & Security"
    | "Business Systems";
  client: string;
  tagline: string;
  description: string;
  challenge: string;
  solution: string;
  impactMetrics: { label: string; value: string }[];
  technologies: string[];
  image: string;
  year: string;
  featured: boolean;
  /** Show in homepage Live Projects section */
  liveProject?: boolean;
  demoUrl?: string;
  /** Optional showcase video (mp4/webm URL) — shown instead of image when set */
  videoUrl?: string;
  /** Tall homepage screenshot — hover/click scrolls top→bottom inside a fixed card window */
  scrollPreview?: boolean;
}

export const projectsData: Project[] = [
  {
    id: "frontend-eight-kappa-23",
    title: "Custom Business Booking Website",
    category: "Websites & Apps",
    client: "Kodraxelsoft Client Delivery",
    tagline: "Built for fast loading, clear layouts, and high sales.",
    description:
      "A modern business website designed to load instantly on mobile phones. Visitors find services quickly and book appointments without confusion.",
    challenge:
      "The client needed a professional online presence that loads fast on mobile and stays reliable during traffic spikes.",
    solution:
      "We shipped a clean, high-performance frontend with polished UI, responsive layouts, and a structure that supports ongoing content updates.",
    impactMetrics: [
      { label: "Mobile Ready", value: "100%" },
      { label: "Load", value: "Instant" },
      { label: "Online", value: "Always" },
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    image: "/portfolio-screenshots/frontend-eight-kappa-23.png",
    year: "2026",
    featured: true,
    liveProject: true,
    demoUrl: "https://frontend-eight-kappa-23.vercel.app/",
    scrollPreview: true,
  },
  {
    id: "spiffy-taffy-7a6040",
    title: "Modern Brand Website",
    category: "Websites & Apps",
    client: "Kodraxelsoft Client Delivery",
    tagline: "Premium online presentation to convert store visitors.",
    description:
      "A clean, sleek website built to look professional and make your brand stand out. Fast pages keep shoppers engaged and browsing longer.",
    challenge:
      "The client needed a modern online presence that feels premium on every screen and keeps visitors engaged from the first scroll.",
    solution:
      "We built a responsive frontend with clear hierarchy, polished visuals, and a structure optimized for speed and easy browsing.",
    impactMetrics: [
      { label: "Mobile Ready", value: "100%" },
      { label: "Load", value: "Instant" },
      { label: "Online", value: "Always" },
    ],
    technologies: ["HTML/CSS", "JavaScript", "Responsive UI", "Netlify"],
    image: "/portfolio-screenshots/spiffy-taffy-7a6040.png",
    year: "2026",
    featured: true,
    liveProject: true,
    demoUrl: "https://spiffy-taffy-7a6040.netlify.app/",
    scrollPreview: true,
  },
  {
    id: "fitness-zone-next",
    title: "Fitness Zone — Gym & Booking Platform",
    category: "Websites & Apps",
    client: "Kodraxelsoft Client Delivery",
    tagline: "Next-gen member platform for fitness centers and trainers.",
    description:
      "A fast mobile platform that lets gym members sign up, book daily workout sessions, and view training schedules effortlessly.",
    challenge:
      "The client needed a high-energy fitness website that feels premium on mobile and guides visitors to join or explore programs quickly.",
    solution:
      "We shipped a Next.js frontend with strong visual branding, responsive layouts, and performance-focused delivery for a smooth gym browsing experience.",
    impactMetrics: [
      { label: "Mobile Ready", value: "100%" },
      { label: "Load", value: "Instant" },
      { label: "Online", value: "Always" },
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    image: "/portfolio-screenshots/fitness-zone-next.png",
    year: "2026",
    featured: true,
    liveProject: true,
    demoUrl: "https://fitness-zone-next.vercel.app/",
    scrollPreview: true,
  },
  {
    id: "aegis-ai",
    title: "Aegis AI — Smart Security Guard",
    category: "AI & Smart Automation",
    client: "Aegis CyberCorp (San Francisco)",
    tagline: "Automated protection that blocks digital threats in real time.",
    description:
      "Built an intelligent defense system that scans business files 24/7, catching security risks instantly to keep company data safe.",
    challenge:
      "Existing threat detection relied on manual rule definitions, resulting in high false-positive rates and slow response times during active cyber attacks.",
    solution:
      "Designed a fine-tuned transformer model coupled with vector log memory that autonomously isolates compromised microservices in real time.",
    impactMetrics: [
      { label: "Threat Protection", value: "99.8%" },
      { label: "Alerts", value: "Instant" },
      { label: "Saved", value: "$4.2M/yr" },
    ],
    technologies: ["PyTorch", "Next.js", "Python", "FastAPI", "Pinecone", "Tailwind CSS"],
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    year: "2026",
    featured: true,
    liveProject: false,
    demoUrl: "https://example.com",
  },
  {
    id: "velox-fintech",
    title: "High-Performance Trading & Business Portal",
    category: "Finance & Security",
    client: "Velox Global Capital (London)",
    tagline: "Lightning-fast portal for high-volume transactions.",
    description:
      "Replaced a slow, outdated computer system with a modern digital platform that executes customer trade actions instantly without freezing.",
    challenge:
      "Legacy browser-based platforms experienced rendering stutters during periods of peak market volatility, causing slippage for traders.",
    solution:
      "Developed a fast, simple layout that handles high volumes of customer activity smoothly — with zero technical training needed for staff.",
    impactMetrics: [
      { label: "Daily Volume", value: "Processed" },
      { label: "Screen Response", value: "Instant" },
      { label: "Faster Speed", value: "85%" },
    ],
    technologies: ["Next.js App Router", "TypeScript", "GSAP", "WebAssembly", "WebSockets"],
    image:
      "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=1200",
    year: "2025",
    featured: true,
    liveProject: false,
    demoUrl: "https://example.com",
  },
  {
    id: "nexus-health",
    title: "Nexus Health — Telemedicine & Patient Portal",
    category: "Websites & Apps",
    client: "Nexus Health Alliance (Boston)",
    tagline: "Ultra-secure patient portal with smart AI triage.",
    description:
      "Designed a safe, easy-to-use healthcare system. Patients book video doctor visits quickly while keeping all private health records completely protected.",
    challenge:
      "Slow legacy medical portals led to high patient drop-off rates and inefficient doctor schedule management.",
    solution:
      "Created an intuitive Next.js application with WebRTC peer-to-peer video streaming and automated AI patient intake summaries.",
    impactMetrics: [
      { label: "Active Patients", value: "450K+" },
      { label: "Doctor Wait Time", value: "-80%" },
      { label: "Patient Rating", value: "4.9/5" },
    ],
    technologies: ["Next.js", "WebRTC", "Tailwind CSS", "PostgreSQL", "OpenAI API"],
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
    year: "2025",
    featured: true,
    liveProject: false,
    demoUrl: "https://example.com",
  },
  {
    id: "strata-cloud",
    title: "Smart Employee & Resource Manager",
    category: "Business Systems",
    client: "Strata Infrastructure Inc (New York)",
    tagline: "Assign tasks, track work hours, and finish projects on time.",
    description:
      "A clean digital dashboard that helps business managers track team tasks, organize schedules, and eliminate stressful project delays.",
    challenge:
      "Fragmented tools made it hard for managers to see who was busy, what was late, and where work was stuck.",
    solution:
      "Built a clear dashboard so teams assign tasks, track hours, and ship projects without the usual chaos.",
    impactMetrics: [
      { label: "Waste Reduction", value: "38%" },
      { label: "Tasks Managed", value: "10,000+" },
      { label: "Setup Time", value: "14 Days" },
    ],
    technologies: ["Next.js", "Go", "Docker", "Kubernetes", "Grafana API", "GSAP"],
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    year: "2026",
    featured: true,
    liveProject: true,
    demoUrl: "https://example.com",
  },
  {
    id: "omni-commerce",
    title: "Fast-Loading Online Store Platform",
    category: "Websites & Apps",
    client: "Omni Luxury Retail (Paris)",
    tagline: "Built to handle huge shopping crowds without crashing.",
    description:
      "Engineered to manage thousands of concurrent shoppers during major online sales events, guaranteeing zero sales lost due to site crashes.",
    challenge:
      "Monolithic e-commerce platform suffered from slow page loads during global flash sales, resulting in lost conversions.",
    solution:
      "Deployed a distributed Next.js edge storefront with dynamic image optimization and instant page prefetching.",
    impactMetrics: [
      { label: "Sales Conversion", value: "+42%" },
      { label: "Page Load", value: "Instant" },
      { label: "Crash Guarantee", value: "Zero" },
    ],
    technologies: ["Next.js App Router", "Tailwind CSS", "Shopify Storefront API", "GSAP", "Three.js"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    year: "2025",
    featured: true,
    liveProject: true,
    demoUrl: "https://example.com",
  },
];
