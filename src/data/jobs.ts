export interface JobRole {
  id: string;
  title: string;
  department: "Engineering" | "AI & Data" | "Product & Design" | "Growth";
  location: string;
  type: string;
  salaryRange: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
}

export const jobRoles: JobRole[] = [
  {
    id: "senior-fullstack-engineer",
    title: "Senior Full-Stack Engineer (Next.js & Rust)",
    department: "Engineering",
    location: "Remote / Hybrid (San Francisco)",
    type: "Full-Time",
    salaryRange: "$160,000 - $210,000 + Equity",
    experience: "5+ Years",
    description: "Work directly alongside founder Alexandre Vance to build ultra-low latency Next.js web applications, custom microservices, and edge computing architectures for enterprise clients.",
    responsibilities: [
      "Architect and ship Next.js App Router applications with strict TypeScript typing",
      "Optimize server-side render paths, caching layers, and database queries",
      "Collaborate with creative lead Elena on complex GSAP animation pipelines",
      "Mentor junior team members and participate in architectural design reviews"
    ],
    requirements: [
      "5+ years building production Next.js / React applications at scale",
      "Deep mastery of TypeScript, Node.js, and SQL / PostgreSQL databases",
      "Experience with Tailwind CSS, state management, and edge runtimes",
      "Strong understanding of web security, CORS, and OAuth protocol"
    ],
    perks: [
      "Competitive base salary + early founding team equity package",
      "100% remote flexibility with $3,000 home office budget",
      "Unlimited PTO with mandatory 3-week minimum annual leave",
      "Direct 1-on-1 engineering mentorship from our 4 founders"
    ]
  },
  {
    id: "ai-research-engineer",
    title: "AI Research Engineer (LLMs & Multi-Agent)",
    department: "AI & Data",
    location: "Remote / Hybrid (Boston)",
    type: "Full-Time",
    salaryRange: "$175,000 - $230,000 + Equity",
    experience: "4+ Years",
    description: "Join Dr. Marcus Chen in designing custom fine-tuned Large Language Model pipelines, vector retrieval engines, and multi-agent AI systems for Fortune 500 partners.",
    responsibilities: [
      "Train and fine-tune open-weight models (Llama, Mistral) on enterprise datasets",
      "Build low-latency RAG pipelines with Pinecone, Qdrant, and Milvus",
      "Develop custom Python APIs and gRPC services using PyTorch and FastAPI",
      "Conduct benchmark evaluations on AI model hallucination rates and accuracy"
    ],
    requirements: [
      "M.S. or B.S. in Computer Science, Machine Learning, or related technical field",
      "Proven track record deploying LLMs or transformer models in production",
      "Fluent in Python, PyTorch, LangChain, and vector embeddings",
      "Familiarity with CUDA acceleration and GPU cluster deployment"
    ],
    perks: [
      "Access to dedicated GPU clusters for AI research and experimentation",
      "Full coverage health, dental, and vision insurance",
      "Annual $5,000 conference & continuous learning stipend",
      "Flexible working hours across US and European time zones"
    ]
  },
  {
    id: "creative-technologist",
    title: "Creative Technologist & UI Engineer",
    department: "Product & Design",
    location: "Remote / Hybrid (London)",
    type: "Full-Time",
    salaryRange: "$140,000 - $185,000 + Equity",
    experience: "3+ Years",
    description: "Partner with creative lead Elena Rostova to build award-winning web interfaces, micro-interaction libraries, WebGL canvas effects, and GSAP scroll experiences.",
    responsibilities: [
      "Transform Figma prototypes into pixel-perfect React / Next.js code",
      "Implement GSAP Timeline and ScrollTrigger animation sequences",
      "Maintain and expand Kodraxelsoft's modern design system component library",
      "Ensure 60 FPS rendering performance across mobile and desktop devices"
    ],
    requirements: [
      "3+ years building creative web experiences with React and GSAP / Three.js",
      "Expert knowledge of CSS layout, SVG manipulation, and Tailwind CSS v4",
      "Obsessive attention to visual detail, typography, and micro-physics",
      "Strong portfolio demonstrating creative interactive web projects"
    ],
    perks: [
      "Latest M3/M4 Max MacBook Pro + 4K dual monitor setup provided",
      "Annual team retreats in top tech hubs worldwide",
      "Generous health & wellness monthly allowance ($250/mo)",
      "Opportunity to win international web design awards"
    ]
  }
];
