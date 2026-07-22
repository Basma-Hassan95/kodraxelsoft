export interface Project {
  id: string;
  title: string;
  category: "SaaS & Web Apps" | "AI & Machine Learning" | "Fintech" | "Enterprise Systems";
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
  demoUrl?: string;
}

export const projectsData: Project[] = [
  {
    id: "aegis-ai",
    title: "Aegis AI - Autonomous Security Protocol",
    category: "AI & Machine Learning",
    client: "Aegis CyberCorp (San Francisco)",
    tagline: "Real-time threat mitigation powered by autonomous neural agents.",
    description: "Built an enterprise AI defense engine that processes over 50,000 security logs per second with sub-10ms neural anomaly detection.",
    challenge: "Existing threat detection relied on manual rule definitions, resulting in high false-positive rates and slow response times during active cyber attacks.",
    solution: "Designed a fine-tuned transformer model coupled with vector log memory that autonomously isolates compromised microservices in real time.",
    impactMetrics: [
      { label: "Threat Detection Rate", value: "99.8%" },
      { label: "Response Latency", value: "<8ms" },
      { label: "Cost Savings", value: "$4.2M/yr" }
    ],
    technologies: ["PyTorch", "Next.js", "Python", "FastAPI", "Pinecone", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    year: "2026",
    featured: true,
    demoUrl: "https://example.com"
  },
  {
    id: "velox-fintech",
    title: "Velox Pay - High-Frequency Trading Portal",
    category: "Fintech",
    client: "Velox Global Capital (London)",
    tagline: "Ultra-low latency institutional trading platform with real-time analytics.",
    description: "Engineered a high-frequency financial execution dashboard handling $1.4B in daily transaction volume with 60 FPS real-time canvas charting.",
    challenge: "Legacy browser-based platforms experienced rendering stutters during periods of peak market volatility, causing slippage for traders.",
    solution: "Developed a WebAssembly data streaming engine paired with custom WebGL canvas charts and GSAP reactive animations.",
    impactMetrics: [
      { label: "Daily Volume Executed", value: "$1.4B" },
      { label: "UI Frame Rate", value: "60 FPS" },
      { label: "Latency Reduction", value: "85%" }
    ],
    technologies: ["Next.js App Router", "TypeScript", "GSAP", "WebAssembly", "WebSockets"],
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=1200",
    year: "2025",
    featured: true,
    demoUrl: "https://example.com"
  },
  {
    id: "nexus-health",
    title: "Nexus Health - Telemedicine Operating System",
    category: "SaaS & Web Apps",
    client: "Nexus Health Alliance (Boston)",
    tagline: "HIPAA-compliant patient portal & instant AI triage assistant.",
    description: "Designed and built an end-to-end healthcare SaaS platform powering encrypted video consultations, automated prescription workflows, and instant patient symptom analysis.",
    challenge: "Slow legacy medical portals led to high patient drop-off rates and inefficient doctor schedule management.",
    solution: "Created an intuitive Next.js application with WebRTC peer-to-peer video streaming and automated AI patient intake summaries.",
    impactMetrics: [
      { label: "Active Patients", value: "450K+" },
      { label: "Doctor Intake Time", value: "-60%" },
      { label: "Patient Rating", value: "4.9/5" }
    ],
    technologies: ["Next.js", "WebRTC", "Tailwind CSS", "PostgreSQL", "OpenAI API"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
    year: "2025",
    featured: true,
    demoUrl: "https://example.com"
  },
  {
    id: "strata-cloud",
    title: "Strata Orchestrator - Cloud Resource Manager",
    category: "Enterprise Systems",
    client: "Strata Infrastructure Inc (New York)",
    tagline: "Multi-cloud Kubernetes cluster control plane for Fortune 500 enterprises.",
    description: "A centralized cloud management dashboard enabling enterprise DevOps teams to visualize, optimize, and auto-scale 10,000+ container nodes across AWS and GCP.",
    challenge: "Fragmented cloud metrics made it impossible to identify idle cloud instances, leading to millions in wasted cloud spend.",
    solution: "Built a consolidated cloud telemetry dashboard using real-time gRPC streaming and dynamic topological node graphs.",
    impactMetrics: [
      { label: "Cloud Waste Reduction", value: "38%" },
      { label: "Nodes Managed", value: "10,000+" },
      { label: "ROI Payback Time", value: "14 Days" }
    ],
    technologies: ["Next.js", "Go", "Docker", "Kubernetes", "Grafana API", "GSAP"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    year: "2026",
    featured: false,
    demoUrl: "https://example.com"
  },
  {
    id: "omni-commerce",
    title: "Omni Storefront - Headless E-Commerce Core",
    category: "SaaS & Web Apps",
    client: "Omni Luxury Retail (Paris)",
    tagline: "Sub-second global shopping platform built with Next.js edge storefronts.",
    description: "Re-engineered a global luxury fashion brand's e-commerce stack into a sub-second headless storefront with localized currency, dynamic inventory, and rich 3D product previews.",
    challenge: "Monolithic e-commerce platform suffered from slow page loads during global flash sales, resulting in lost conversions.",
    solution: "Deployed a distributed Next.js edge storefront with dynamic image optimization and instant page prefetching.",
    impactMetrics: [
      { label: "Conversion Rate", value: "+42%" },
      { label: "Average Page Load", value: "320ms" },
      { label: "Black Friday Sales", value: "$18.5M" }
    ],
    technologies: ["Next.js App Router", "Tailwind CSS", "Shopify Storefront API", "GSAP", "Three.js"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    year: "2025",
    featured: false,
    demoUrl: "https://example.com"
  }
];
