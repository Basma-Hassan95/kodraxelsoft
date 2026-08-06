export interface JobRole {
  id: string;
  title: string;
  department: string;
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
    title: "Senior Full-Stack Web Developer",
    department: "Engineering",
    location: "Remote / Hybrid",
    type: "Full-Time",
    salaryRange: "$160,000 - $210,000 + Equity",
    experience: "5+ Years",
    description:
      "Work directly with senior leads to build ultra-fast websites and web applications for fast-growing client businesses.",
    responsibilities: [
      "Build ultra-fast websites and web applications for growing client businesses",
      "Collaborate with senior leads on clean architecture and delivery",
      "Maintain strong security and database practices",
      "Ship reliable modern web apps with clear communication",
    ],
    requirements: [
      "5+ years of experience building fast, reliable modern web apps.",
      "Strong expertise in clean code practices, security, and databases.",
    ],
    perks: [
      "Competitive base salary + equity package",
      "Remote-first flexibility",
      "Direct mentorship from senior architects",
      "Annual company retreats",
    ],
  },
  {
    id: "ai-research-engineer",
    title: "AI & Smart Automation Specialist",
    department: "AI & Data",
    location: "Remote / Hybrid",
    type: "Full-Time",
    salaryRange: "$175,000 - $230,000 + Equity",
    experience: "4+ Years",
    description:
      "Help design and train custom AI helpers, digital assistants, and automated workflows for large enterprise clients.",
    responsibilities: [
      "Design and train custom AI helpers and digital assistants",
      "Build automated workflows for enterprise clients",
      "Work with smart data pipelines and automation tools",
      "Deploy reliable AI systems that save teams time",
    ],
    requirements: [
      "Hands-on experience building and deploying custom AI/LLM systems.",
      "Deep understanding of Python, smart data pipelines, and automation tools.",
    ],
    perks: [
      "Competitive base salary + equity package",
      "Remote-first flexibility",
      "Direct mentorship from senior architects",
      "Annual company retreats",
    ],
  },
  {
    id: "creative-technologist",
    title: "Creative UI Designer & Developer",
    department: "Product & Design",
    location: "Remote / Hybrid",
    type: "Full-Time",
    salaryRange: "$140,000 - $185,000 + Equity",
    experience: "3+ Years",
    description:
      "Partner with our design lead to build clean, interactive, and super-easy-to-use web layouts that users fall in love with.",
    responsibilities: [
      "Build clean, interactive, easy-to-use web layouts",
      "Partner with design lead on visual quality and flow",
      "Deliver smooth, highly responsive websites",
      "Obsess over typography, detail, and clear design",
    ],
    requirements: [
      "3+ years of experience building smooth, highly responsive websites.",
      "Obsessive attention to visual detail, typography, and clear design flow.",
    ],
    perks: [
      "Competitive base salary + equity package",
      "Remote-first flexibility",
      "Direct mentorship from senior architects",
      "Annual company retreats",
    ],
  },
];
