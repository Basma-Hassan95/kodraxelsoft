export interface Service {
  id: string;
  iconName: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  deliverables: string[];
  basePrice: string;
  estimatedWeeks: string;
  technologies: string[];
}

export const servicesData: Service[] = [
  {
    id: "web-architecture",
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
  }
];
