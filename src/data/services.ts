export interface Service {
  id: string;
  slug?: string;
  iconName: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  deliverables: string[];
  basePrice: string;
  estimatedWeeks: string;
  technologies: string[];
  /** Background image for accordion / cards */
  imageUrl?: string;
}

export const servicesData: Service[] = [
  {
    id: "web-architecture",
    slug: "web-architecture",
    iconName: "Code",
    title: "Next.js & Cloud Web Apps",
    subtitle: "Ultra-fast, SEO-optimized enterprise platforms",
    description: "We build sub-second web applications leveraging Next.js App Router, React Server Components, custom micro-interactions, and serverless edge deployments.",
    features: [
      "Sub-50ms TTFB global edge deployment",
      "Full SSR & Turbopack architecture",
      "Custom GSAP micro-animations & WebGL",
      "Strict TypeScript & automated CI/CD"
    ],
    deliverables: [
      "Production-ready codebase & repository",
      "Design system & component library",
      "Lighthouse 100/100 performance guarantee",
      "30-day post-launch warranty"
    ],
    basePrice: "$15,000",
    estimatedWeeks: "3 - 5 Weeks",
    technologies: ["Next.js 16", "TypeScript", "Tailwind CSS", "GSAP", "Vercel / AWS"]
  },
  {
    id: "ai-integration",
    slug: "ai-integration",
    iconName: "Cpu",
    title: "AI Models & Autonomous Agents",
    subtitle: "Custom AI pipelines, RAG & LLM agents",
    description: "Empower your business with tailored machine learning workflows, domain-specific AI fine-tuning, vector database search, and real-time automated decision systems.",
    features: [
      "Custom LLM fine-tuning & RAG architectures",
      "Autonomous AI multi-agent orchestrations",
      "Pinecone / Qdrant vector database search",
      "Private self-hosted LLM deployment"
    ],
    deliverables: [
      "Custom trained model endpoints",
      "REST & WebSocket AI APIs",
      "Admin monitoring dashboard",
      "Data privacy & SOC-2 compliance"
    ],
    basePrice: "$22,000",
    estimatedWeeks: "4 - 6 Weeks",
    technologies: ["PyTorch", "Python", "LangChain", "OpenAI / Claude API", "FastAPI"]
  },
  {
    id: "cloud-infrastructure",
    slug: "cloud-infrastructure",
    iconName: "Layers",
    title: "High-Scale Cloud Infrastructure",
    subtitle: "Kubernetes, DevOps & Serverless Systems",
    description: "Zero-downtime microservice orchestration, auto-scaling cloud deployments, and resilient database architectures engineered to support millions of concurrent users.",
    features: [
      "Infrastructure as Code (Terraform & Pulumi)",
      "Multi-region AWS / GCP Kubernetes clusters",
      "Zero-trust security & automated penetration testing",
      "Real-time Grafana & Prometheus telemetry"
    ],
    deliverables: [
      "Automated CI/CD pipelines",
      "Disaster recovery & backup automation",
      "Comprehensive cloud security audit",
      "24/7 Monitoring setup"
    ],
    basePrice: "$18,000",
    estimatedWeeks: "3 - 5 Weeks",
    technologies: ["AWS", "Kubernetes", "Docker", "Terraform", "PostgreSQL"]
  },
  {
    id: "mobile-enterprise",
    slug: "mobile-enterprise",
    iconName: "Zap",
    title: "Cross-Platform Mobile Apps",
    subtitle: "Native-performance iOS & Android solutions",
    description: "Fluid, high-performance mobile applications engineered with React Native and Expo, offering biometrics, offline sync, and real-time push engines.",
    features: [
      "Native 120Hz smooth UI transitions",
      "Offline-first SQLite & Sync engine",
      "Biometric security & Apple/Google Pay",
      "Instant OTA code updates"
    ],
    deliverables: [
      "App Store & Google Play publishing",
      "Cross-platform codebase",
      "Push notification server setup",
      "Analytics & crash reporting"
    ],
    basePrice: "$20,000",
    estimatedWeeks: "4 - 7 Weeks",
    technologies: ["React Native", "Expo", "TypeScript", "GraphQL", "Supabase"]
  },
  {
    id: "ai-automation",
    slug: "ai-automation",
    iconName: "Bot",
    title: "AI Automation & Workflow Agents",
    subtitle: "Intelligent process automation for growing teams",
    description: "We design and ship autonomous automation pipelines that connect your tools, eliminate repetitive manual work, and let AI agents handle support, sales ops, and data entry around the clock.",
    features: [
      "Custom AI agent workflows (support, sales, ops)",
      "Zapier / n8n / Make automation pipelines",
      "AI chatbots & voice assistants with live handoff",
      "Document parsing, OCR & auto data-entry bots"
    ],
    deliverables: [
      "Deployed automation workflows & runbooks",
      "Custom AI agent dashboard",
      "Integration with CRM / email / Slack / WhatsApp",
      "30-day tuning & monitoring window"
    ],
    basePrice: "$8,000",
    estimatedWeeks: "2 - 4 Weeks",
    technologies: ["OpenAI / Claude API", "n8n", "Zapier", "LangChain", "Python", "Node.js"]
  },
  {
    id: "wordpress",
    slug: "wordpress",
    iconName: "Globe",
    title: "WordPress Development",
    subtitle: "Custom themes, plugins & WooCommerce stores",
    description: "Pixel-perfect, fast-loading WordPress builds — from custom-coded themes and headless WordPress front-ends to full WooCommerce storefronts and plugin engineering.",
    features: [
      "Custom-coded themes (no bloated page builders)",
      "WooCommerce store setup & payment integration",
      "Headless WordPress with Next.js front-end option",
      "Core Web Vitals & security hardening"
    ],
    deliverables: [
      "Fully responsive WordPress site",
      "Admin training & documentation",
      "SEO-ready structure & schema markup",
      "30-day post-launch support"
    ],
    basePrice: "$4,500",
    estimatedWeeks: "2 - 4 Weeks",
    technologies: ["WordPress", "WooCommerce", "PHP", "ACF Pro", "MySQL", "Elementor"]
  },
  {
    id: "custom-software",
    slug: "custom-software",
    iconName: "Package",
    title: "Custom Software & SaaS Development",
    subtitle: "Multi-tenant SaaS platforms & internal tools",
    description: "End-to-end product engineering for SaaS founders and enterprises — from multi-tenant architecture and billing to internal dashboards and workflow tools built around your exact business logic.",
    features: [
      "Multi-tenant SaaS architecture & RBAC",
      "Stripe / subscription billing integration",
      "Custom internal tools & admin dashboards",
      "API-first architecture for third-party integrations"
    ],
    deliverables: [
      "Production SaaS codebase & infrastructure",
      "Billing & subscription management setup",
      "Admin & customer-facing dashboards",
      "Technical documentation & handover"
    ],
    basePrice: "$25,000",
    estimatedWeeks: "6 - 10 Weeks",
    technologies: ["Next.js", "PostgreSQL", "Stripe", "TypeScript", "Prisma", "AWS / Vercel"]
  }
];
