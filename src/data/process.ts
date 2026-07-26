export interface ProcessStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  keyDeliverables: string[];
  duration: string;
  leadArchitect: string;
  iconName: string;
}

export const processSteps: ProcessStep[] = [
  {
    stepNumber: "01",
    title: "Architectural Audit & Discovery",
    subtitle: "Aligning product vision with deep technical blueprints.",
    description: "We meet directly with your key engineering stakeholders and product leaders to audit existing codebase bottlenecks, establish strict security parameters, and define the core technical SLA.",
    keyDeliverables: [
      "Technical Architecture Blueprint",
      "Security & Compliance Matrix",
      "Milestone Roadmap & Timeline",
      "Fixed-Price Scope Agreement"
    ],
    duration: "Week 1",
    leadArchitect: "Principal Architect (Core & Cloud)",
    iconName: "Search"
  },
  {
    stepNumber: "02",
    title: "UX Design & Interactive Prototype",
    subtitle: "High-fidelity wireframes & fluid micro-interaction systems.",
    description: "Our design team leads the creation of visual design systems, dark/light palette tokens, responsive grid layouts, and interactive GSAP prototypes that align with your brand's enterprise authority.",
    keyDeliverables: [
      "Figma Design System & Token Set",
      "High-Fidelity Interactive Prototype",
      "Micro-Animation & Motion Spec",
      "Accessibility & Contrast Audit"
    ],
    duration: "Week 2",
    leadArchitect: "Creative Lead (UI & Motion)",
    iconName: "Figma"
  },
  {
    stepNumber: "03",
    title: "Agile Sprint Execution & AI Modeling",
    subtitle: "Clean, strictly-typed TypeScript & AI pipeline integration.",
    description: "Our principal engineers write production-grade Next.js, Python, PyTorch, and Rust components in parallel 1-week sprints with continuous staging deployments and zero technical debt.",
    keyDeliverables: [
      "Daily CI/CD Staging Builds",
      "Automated Unit & E2E Test Suite",
      "Clean Modular Component Hierarchy",
      "Custom AI / Database Endpoints"
    ],
    duration: "Weeks 3 - 4",
    leadArchitect: "AI & Neural Pipeline Lead",
    iconName: "Code2"
  },
  {
    stepNumber: "04",
    title: "Performance & Penetration Security",
    subtitle: "Sub-50ms latency tuning & SOC-2 compliance checks.",
    description: "We conduct stress testing, load balancing simulations, memory leak audits, and automated security vulnerability scans before deploying to global edge infrastructure.",
    keyDeliverables: [
      "100/100 Lighthouse Benchmark Audit",
      "Penetration Security Verification",
      "Cross-Browser & Device Test Report",
      "Database Query Optimization"
    ],
    duration: "Week 5",
    leadArchitect: "Security & DevOps Lead",
    iconName: "ShieldCheck"
  },
  {
    stepNumber: "05",
    title: "Production Launch & Edge Deployment",
    subtitle: "Zero-downtime DNS cutover & telemetry initialization.",
    description: "We execute a seamless cutover to production edge servers (Vercel / AWS / GCP) with active telemetry monitoring to ensure instant response times worldwide.",
    keyDeliverables: [
      "Zero-Downtime DNS Cutover",
      "Live Grafana & Sentry Monitoring",
      "Domain SSL & Edge Routing Setup",
      "Production Handover Package"
    ],
    duration: "Launch Day",
    leadArchitect: "Cloud Delivery Director",
    iconName: "Rocket"
  },
  {
    stepNumber: "06",
    title: "Continuous Optimization & SLA Warranty",
    subtitle: "30-day dedicated warranty & ongoing scaling partnership.",
    description: "Post-launch, our senior engineers stay directly embedded to monitor live traffic metrics, patch minor updates, and help you scale seamlessly to your next growth milestone.",
    keyDeliverables: [
      "30-Day Full Code Warranty",
      "Weekly Performance Reviews",
      "Direct Senior Engineering Support",
      "Growth & Scale Recommendation Brief"
    ],
    duration: "Ongoing",
    leadArchitect: "Technical Operations Lead",
    iconName: "CheckCircle2"
  }
];
