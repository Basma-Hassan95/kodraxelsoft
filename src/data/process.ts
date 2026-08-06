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
    title: "Discovery & Project Blueprint",
    subtitle: "Understanding your goals before writing a single line of code.",
    description:
      "We meet with you to review your current business workflow, set your main goals, and map out a fixed price and timeline for your project.",
    keyDeliverables: [
      "Complete project roadmap & timeline",
      "Security and privacy setup",
      "Fixed-price contract with zero hidden costs",
    ],
    duration: "Week 1",
    leadArchitect: "Principal Architect (Core & Cloud)",
    iconName: "Search",
  },
  {
    stepNumber: "02",
    title: "Design & Interactive Preview",
    subtitle: "Simple, beautiful layouts built for easy customer use.",
    description:
      "Our design team creates modern, clean screen designs. You get to test a clickable prototype so you can see and feel how your product works before it gets built.",
    keyDeliverables: [
      "Mobile-friendly screen layouts",
      "Clickable prototype to test features",
      "Easy-to-read designs for your buyers",
    ],
    duration: "Week 2",
    leadArchitect: "Creative Lead (UI & Motion)",
    iconName: "Figma",
  },
  {
    stepNumber: "03",
    title: "Fast Development & AI Setup",
    subtitle: "Building clean, reliable code and smart tools.",
    description:
      "Our senior experts build your web app, mobile app, or AI assistant. We run weekly updates so you can see live progress as your system comes to life.",
    keyDeliverables: [
      "Weekly progress previews",
      "Automated quality and bug checks",
      "Custom AI helpers & database integration",
    ],
    duration: "Weeks 3 – 4",
    leadArchitect: "AI & Neural Pipeline Lead",
    iconName: "Code2",
  },
  {
    stepNumber: "04",
    title: "Speed Testing & Digital Security",
    subtitle: "Testing every feature to ensure maximum speed and safety.",
    description:
      "We put your software through heavy usage tests to make sure it opens instantly on all phones and stays safe from hackers and security threats.",
    keyDeliverables: [
      "100/100 performance and speed verification",
      "Bank-level security checks",
      "Smooth testing across all browsers and devices",
    ],
    duration: "Week 5",
    leadArchitect: "Security & DevOps Lead",
    iconName: "ShieldCheck",
  },
  {
    stepNumber: "05",
    title: "Live Launch & Going Public",
    subtitle: "Launching your software smoothly with zero downtime.",
    description:
      "We safely move your project live so your customers can start using it immediately. We handle all complex server setups behind the scenes.",
    keyDeliverables: [
      "Zero-downtime website launch",
      "24/7 automated monitoring",
      "Complete administrative handoff package",
    ],
    duration: "Launch Day",
    leadArchitect: "Cloud Delivery Director",
    iconName: "Rocket",
  },
  {
    stepNumber: "06",
    title: "Continuous Care & Warranty",
    subtitle: "Staying by your side after launch to keep your product growing.",
    description:
      "After launch, our team stays attached to your project to monitor system health, make minor updates, and help you scale as your sales grow.",
    keyDeliverables: [
      "30-day post-launch code warranty",
      "Weekly performance checkups",
      "Direct support from senior experts",
    ],
    duration: "Ongoing Care",
    leadArchitect: "Technical Operations Lead",
    iconName: "CheckCircle2",
  },
];
