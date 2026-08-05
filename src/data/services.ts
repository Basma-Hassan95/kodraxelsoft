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
<<<<<<< Updated upstream
=======
  /** Background image for accordion / cards */
  imageUrl?: string;
  /** Detail page — problem / value intro under service title */
  detailProblemIntro?: string;
  /** Detail page — problem section heading override */
  detailProblemTitle?: string;
  /** Detail page — guarantees section intro */
  detailSolutionIntro?: string;
  /** Detail page — guarantees section heading override */
  detailSolutionTitle?: string;
  /** Detail page meta title override */
  metaTitle?: string;
  /** Detail page meta description override */
  metaDescription?: string;
  /** Detail page CTA headline */
  ctaTitle?: string;
  /** Detail page CTA body */
  ctaBody?: string;
  /** Optional middle pill on detail page (e.g. Ongoing Support) */
  detailMiddleBadge?: string;
  /** Scope / agreement pill — defaults to Fixed Scope Project */
  detailScopeBadge?: string;
>>>>>>> Stashed changes
}

export const servicesData: Service[] = [
  {
    id: "ai-automation-workflow",
    slug: "ai-automation-workflow",
    iconName: "Bot",
    title: "AI Automation & Smart Workflows",
    subtitle: "Connect Your Apps & Cut Manual Work",
    description:
      "Connect all your business software so data syncs automatically, saving your team hours of manual typing every day.",
    features: [
      "Connect your CRM, emails, payment systems, and chat tools into one clean workflow.",
      "Automatic real-time data sync across all your everyday business applications.",
      "Fewer repetitive manual tasks and zero costly human typing errors.",
      "Clear automated reports so you always know how your business is performing.",
    ],
    deliverables: [
      "Fully automated workflows delivered ready to use on day one.",
      "Simple, step-by-step video guide so your team can use it easily.",
      "Seamless integration with the primary software tools you already pay for.",
      "Includes a 30-day post-launch optimization and tech support window.",
    ],
    basePrice: "Custom Quote",
    estimatedWeeks: "2-3 Weeks",
    technologies: ["n8n", "Zapier", "Make", "OpenAI API", "Node.js"],
    metaTitle: "AI Automation & Smart Workflow Services | Kodraxelsoft",
    metaDescription:
      "Eliminate repetitive manual tasks, sync business apps automatically, and save 15+ hours weekly with custom workflow automations built by Kodraxelsoft.",
    detailProblemIntro:
      "Connect your existing business apps together into one automated engine so data moves seamlessly without human intervention.",
    detailSolutionIntro:
      "A simple, human-first delivery approach—clear scope, senior expert execution, and zero technical hassle from day one.",
    ctaTitle: "Ready to Start Your AI Automation Project?",
    ctaBody:
      "Book a free discovery call with our senior architects to map out your custom automation plan within 24 hours.",
  },
  {
    id: "autonomous-ai-agents",
    slug: "autonomous-ai-agents",
    iconName: "Cpu",
    title: "Smart AI Assistants",
    subtitle: "Digital Helpers That Work 24/7",
    description:
      "Train intelligent digital helpers on your private business files, FAQs, and products to answer customer queries 24/7, qualify leads, and automate daily routines.",
    features: [
      "24/7 Instant Messaging: Resolves client questions on your website live chat, WhatsApp, or email inbox without keeping buyers waiting.",
      "Smart Lead Qualification: Automatically asks pre-screening questions to identify high-value sales prospects and route them directly to your sales team.",
      "Automated Booking & Scheduling: Connects directly with your team calendar to schedule meetings, demos, and service calls automatically.",
      "Trained on Your Private Business Data: Upload your custom PDF guides, price lists, and service manuals so your AI assistant provides accurate, non-generic answers.",
    ],
    deliverables: [
      "Brand-Tailored Custom AI Assistant: Configured to speak in your exact brand voice and follow your preferred customer service guidelines.",
      "Smooth Human Handoff: Pass complex or sensitive client conversations smoothly from the AI chatbot straight to a live human agent.",
      "Centralized Admin Dashboard: Review conversation logs, track response speeds, and update training documents anytime with zero coding.",
      "30-Day Performance & Optimization Window: Includes post-launch monitoring to continuously fine-tune answer accuracy and user engagement.",
    ],
    basePrice: "Custom Quote",
    estimatedWeeks: "3-4 Weeks",
    technologies: ["OpenAI API", "Claude API", "LangChain", "Python", "Node.js"],
    metaTitle: "Custom Smart AI Assistants for Business | 24/7 Automated Support",
    metaDescription:
      "Train custom AI assistants on your business data to handle 24/7 customer support, qualify sales leads, and automate appointments with zero human error.",
    detailProblemTitle: "24/7 Smart Customer Support & Sales Automation",
    detailProblemIntro:
      "Stop losing potential buyers due to delayed responses. Our custom AI assistants engage your website visitors instantly, answer complex questions using your real company data, and guide clients directly to purchase.",
    detailSolutionTitle: "Custom AI Solutions Built for Real Business Results",
    detailSolutionIntro:
      "We handle all technical setup behind the scenes. You get a ready-to-use digital assistant tailored specifically to your company brand, tone, and operational rules.",
    ctaTitle: "Ready to Deploy Your Custom AI Assistant?",
    ctaBody:
      "Book a free 15-minute consultation with our lead architects to map out your custom AI implementation strategy within 24 hours.",
  },
  {
    id: "shopify-seo-stores",
    slug: "shopify-seo-stores",
    iconName: "Package",
    title: "SEO-Optimized Shopify Stores",
    subtitle: "Fast Stores Built to Rank & Sell",
    description:
      "A complete Shopify store setup designed to load instantly on phones, rank on Google, and convert casual visitors into paying customers.",
    features: [
      "SEO-Ready Store Structure: Optimized page titles, meta tags, and collection layouts built to rank higher on Google search results.",
      "Lightning-Fast Mobile Speed: Sub-second page load times on smartphones to keep shoppers engaged without leaving your site.",
      "Frictionless 2-Step Checkout: Clean, user-friendly checkout process designed to reduce cart abandonment and increase conversion rates.",
      "Complete Product & Payment Setup: Full setup of product categories, payment gateways, automated shipping rules, and tax settings.",
    ],
    deliverables: [
      "Live Shopify Store Ready for Sales: Fully branded, modern storefront delivered ready to process customer orders on launch day.",
      "Seamless Payment & Shipping Integration: Integrated local and international payment gateways alongside automated shipping calculators.",
      "Optimized Product Catalog & Pages: Clean product layout design with high-resolution image galleries and clear call-to-action buttons.",
      "30-Day Post-Launch Support Window: Includes post-launch assistance to fine-tune store performance and guide your team on managing orders.",
    ],
    basePrice: "PKR 15,000",
    estimatedWeeks: "2 Weeks",
    technologies: ["Shopify", "Liquid", "SEO Tools", "Payment Gateways"],
    metaTitle: "Custom SEO-Optimized Shopify Store Development | Kodraxelsoft",
    metaDescription:
      "Get a fast, high-converting Shopify store built for high sales and top Google rankings. Complete setup, payment gateways, and zero technical hassle.",
    detailProblemTitle: "SEO-Optimized Shopify Stores Built for Maximum Sales",
    detailProblemIntro:
      "Stop losing customers to slow loading times and confusing checkout pages. We build modern Shopify stores designed to give shoppers a seamless mobile experience and drive consistent online sales.",
    detailSolutionTitle: "E-Commerce Websites Built for Real Growth",
    detailSolutionIntro:
      "We take care of all the technical setup behind the scenes so you can focus entirely on marketing and growing your products.",
    ctaTitle: "Ready to Start Your Shopify Store Project?",
    ctaBody:
      "Book a free 15-minute discovery call with our e-commerce leads to map out your online store launch within 24 hours.",
  },
  {
    id: "wordpress-seo-websites",
    slug: "wordpress-seo-websites",
    iconName: "Globe",
    title: "Easy-to-Edit WordPress Websites",
    subtitle: "Beautiful Sites You Can Manage Yourself",
    description:
      "Clean, professional WordPress websites built with intuitive visual controls so you can update text, images, and content without calling a developer.",
    features: [
      "Clean Mobile-First Layouts: Optimized visual design that looks perfect and loads fast across all smartphones, tablets, and desktop screens.",
      "Simple Visual Content Editing: Easy drag-and-drop page editor tailored so your team can publish updates, blog posts, and photos in seconds.",
      "Built-In Speed & Security Hardening: Advanced security setups and caching plugins to protect your site from threats and maintain top speeds.",
      "SEO-Ready Page Architecture: Structured clean code, image optimization, and meta tags configured to help your business rank on local search results.",
    ],
    deliverables: [
      "Complete Custom WordPress Site: Fully designed and tested website delivered ready for launch on your own domain.",
      "1-on-1 Admin Dashboard Walkthrough: Step-by-step guidance and recorded video walkthrough showing your team how to edit content effortlessly.",
      "SEO-Optimized Pages & Blog Setup: Pre-formatted landing pages, contact forms, and news sections structured for search engines.",
      "30-Day Post-Launch Support Window: Includes 30 days of direct technical support to assist with initial updates and answer any questions.",
    ],
    basePrice: "PKR 18,000",
    estimatedWeeks: "2 Weeks",
    technologies: ["WordPress", "Elementor", "PHP", "MySQL", "SEO Plugins"],
    metaTitle: "Custom Easy-to-Edit WordPress Websites | Kodraxelsoft",
    metaDescription:
      "Get a fast, secure, and professional WordPress website built with easy visual controls. Update text, images, and blogs anytime without coding.",
    detailProblemTitle: "Easy-to-Edit WordPress Websites for Growing Businesses",
    detailProblemIntro:
      "Stop depending on expensive developers for simple text and image edits. We build modern, flexible WordPress websites that give you 100% control over your digital storefront while keeping page speeds ultra-fast.",
    detailSolutionTitle: "Professional Solutions Built for Hassle-Free Management",
    detailSolutionIntro:
      "We manage the technical architecture behind the scenes and deliver a fully configured website ready to generate leads for your business.",
    ctaTitle: "Ready to Start Your Easy-to-Edit WordPress Website Project?",
    ctaBody:
      "Book a free 15-minute discovery call with our senior leads to plan your custom WordPress launch within 24 hours.",
  },
  {
    id: "custom-web-apps",
    slug: "custom-web-apps",
    iconName: "Code",
    title: "Custom Web Application Development",
    subtitle: "Tailored Business Tools & Portals",
    description:
      "Custom web portals, internal dashboards, and client platforms engineered for ultra-fast loading speeds, enterprise security, and zero system crashes.",
    features: [
      "Tailored Web Dashboards: Custom analytics, reporting tools, and administrative controls designed specifically around your daily business operations.",
      "Role-Based Access & Bank-Grade Security: Encrypted login portals with custom user permissions to protect sensitive client and company data.",
      "Modern MERN & Next.js Stack: Engineered with modern web frameworks to guarantee instant page transitions and high performance under heavy traffic.",
      "Custom API & Third-Party Integrations: Seamlessly connect your custom web application with payment processors, CRMs, and external business software.",
    ],
    deliverables: [
      "Production-Ready Web Platform: Fully tested, bug-free web application configured directly on your cloud server architecture.",
      "User & Admin Interface Screens: Clean, accessible responsive designs crafted for both internal management and end-user engagement.",
      "Complete Technical Handover Documentation: Comprehensive architectural documentation and API keys provided for full platform ownership.",
      "30-Day Post-Launch Warranty Window: Includes dedicated technical support and system monitoring to ensure smooth operations after launch.",
    ],
    basePrice: "Custom Quote",
    estimatedWeeks: "4-6 Weeks",
    technologies: ["Next.js", "React", "Node.js", "MongoDB", "PostgreSQL", "TypeScript"],
    metaTitle: "Custom Web Application Development Services | Kodraxelsoft",
    metaDescription:
      "Build fast, reliable, and secure web portals, client dashboards, and custom SaaS platforms engineered with Next.js and MERN stack by Kodraxelsoft.",
    detailProblemTitle: "Custom Web Application Development Built for Scale",
    detailProblemIntro:
      "Replace rigid off-the-shelf software with tailored web applications designed specifically around your operational needs. We build scalable digital platforms that handle complex workflows smoothly.",
    detailSolutionTitle: "Scalable Digital Solutions Built for Real Impact",
    detailSolutionIntro:
      "Our senior engineering team handles full-stack development, database design, and deployment so your business receives a battle-tested, production-ready product.",
    ctaTitle: "Ready to Start Your Custom Web Application Project?",
    ctaBody:
      "Book a free 15-minute discovery call with our senior architects to map out your custom software plan within 24 hours.",
  },
  {
    id: "mobile-app-development",
    slug: "mobile-app-development",
    iconName: "Zap",
    title: "Mobile Application Development (iOS & Android)",
    subtitle: "Smooth Mobile Apps for Apple & Android",
    description:
      "High-performance mobile apps with smooth transitions, offline support, and easy mobile payment integrations your customers will love.",
    features: [
      "Single Codebase for iOS & Android: High-performance cross-platform build that runs smoothly across both Apple App Store and Google Play.",
      "Modern & Intuitive App Interfaces: Clean UI designs tailored for small screens to ensure effortless navigation and high user retention.",
      "Instant Push Notifications: Re-engage customers instantly with personalized offers, order updates, and real-time alerts.",
      "App Store & Google Play Publishing Support: End-to-end guidance to navigate store guidelines and get your mobile application approved without delay.",
    ],
    deliverables: [
      "Production-Ready iOS & Android Builds: Thoroughly tested mobile applications built with stable architectures for zero crashes.",
      "App Store Listing & Asset Preparation: Complete setup of promotional graphics, privacy policies, and app store description tags.",
      "Automated Push Notification Integration: Seamless integration of user messaging tools to communicate directly with your customer base.",
      "30-Day Post-Launch Warranty Window: Dedicated post-launch support to monitor initial app store reviews, fix minor issues, and optimize speed.",
    ],
    basePrice: "Custom Quote",
    estimatedWeeks: "6-8 Weeks",
    technologies: ["React Native", "Expo", "TypeScript", "Firebase"],
    metaTitle: "Mobile Application Development (iOS & Android) | Kodraxelsoft",
    metaDescription:
      "Build fast, high-performance iOS and Android mobile apps. Seamless performance, push notifications, offline support, and complete App Store publishing.",
    detailProblemTitle: "Mobile Application Development (iOS & Android) Built for Scale",
    detailProblemIntro:
      "Turn your business vision into a powerful smartphone app. We build native-quality mobile applications for Apple iPhones and Android devices that keep users engaged and buying.",
    detailSolutionTitle: "Professional App Delivery Built for Market Success",
    detailSolutionIntro:
      "Our mobile engineers handle everything from screen layouts and database links to cloud deployment, ensuring a stable release on day one.",
    ctaTitle: "Ready to Start Your Mobile Application Development Project?",
    ctaBody:
      "Book a free 15-minute discovery call with our senior architects to map out your mobile app launch within 24 hours.",
  },
  {
    id: "ui-ux-product-design",
    slug: "ui-ux-product-design",
    iconName: "Layers",
    title: "UI/UX & Product Design",
    subtitle: "Clean Layouts Before Writing Code",
    description:
      "Interactive screen designs and visual prototypes so you can test and approve your app’s exact look and feel before development begins.",
    features: [
      "Wireframes & Clickable Design Previews: Interactive prototypes so you can click through every app screen and workflow before coding starts.",
      "Modern Layouts Focused on Conversion: Intuitive UI structures designed to minimize user effort and maximize action completion.",
      "Mobile-First Responsive Screens: Tailored visual experiences optimized for small mobile displays, tablets, and large desktop monitors.",
      "Scalable Brand Design Systems: Standardized typography, color tokens, and UI components for a consistent visual identity.",
    ],
    deliverables: [
      "Complete UI/UX Design Source Files: Full vector-based Figma projects structured with auto-layouts, layers, and organized styles.",
      "Clickable Prototype for Stakeholder Review: Shareable interactive links so partners, clients, and testers can review the app flow live.",
      "Developer-Ready Design Handoff: Pixel-perfect export specs, CSS attributes, and asset packages for smooth frontend building.",
      "Collaborative Revision Phase Included: Dedicated feedback rounds to refine interface details and align with your vision.",
    ],
    basePrice: "Custom Quote",
    estimatedWeeks: "1-2 Weeks",
    technologies: ["Figma", "FigJam", "Adobe XD", "Prototyping"],
    metaTitle: "UI/UX & Product Design Services | Kodraxelsoft",
    metaDescription:
      "Get intuitive UI/UX and product designs with clickable Figma prototypes. We craft mobile-first interfaces and design systems that boost conversions.",
    detailProblemTitle: "UI/UX & Product Design Built for User Engagement",
    detailProblemIntro:
      "Avoid spending money on custom code until you are 100% satisfied with the visual design. We create sleek, human-centered interfaces that make your web and mobile applications easy and enjoyable to navigate.",
    detailSolutionTitle: "Visual Solutions Built for Seamless Developer Handoff",
    detailSolutionIntro:
      "Our design process yields clean, organized UI assets that your development team (or ours) can transform into working code without missing details.",
    ctaTitle: "Ready to Start Your UI/UX Project?",
    ctaBody:
      "Book a free 15-minute discovery call with our design leads to map out your product design strategy within 24 hours.",
  },
  {
    id: "graphic-brand-identity",
    slug: "graphic-brand-identity",
    iconName: "Sparkles",
    title: "Graphic Design & Brand Identity",
    subtitle: "Logos & Visuals That Make You Stand Out",
    description:
      "Modern logos, brand color guidelines, and marketing graphics that make your business look established, trustworthy, and highly professional.",
    features: [
      "Custom Logo & Brand Mark Design: Scalable vector logos designed from scratch to reflect your company's core values and positioning.",
      "Social Media Graphics for Posts & Ads: Eye-catching digital templates tailored for Instagram, LinkedIn, Facebook, and paid ad campaigns.",
      "Color Palette & Typography Guidelines: Standardized color codes and font pairings ensuring visual consistency across all customer touchpoints.",
      "Business Cards & Marketing Visuals: Print-ready stationary designs, pitch deck assets, brochures, and digital banners.",
    ],
    deliverables: [
      "Complete Logo Pack in Multiple Formats: High-resolution vector files provided in SVG, PNG, EPS, and PDF formats for web and print.",
      "Comprehensive Brand Style Guide: Simple PDF manual defining proper logo usage, clear space rules, typography scales, and color codes.",
      "Social Media Starter Kit: Editable banner covers, profile assets, and post layout templates ready for marketing use.",
      "Print-Ready Marketing Files: Fully prepared CMYK files with bleed margins set up for hassle-free commercial printing.",
    ],
    basePrice: "Custom Quote",
    estimatedWeeks: "1-2 Weeks",
    technologies: ["Adobe Illustrator", "Photoshop", "Figma", "Canva Pro"],
    imageUrl:
      "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&q=80&w=1400",
    metaTitle: "Graphic Design & Brand Identity Services | Kodraxelsoft",
    metaDescription:
      "Build a memorable brand identity with modern logo designs, professional brand guidelines, social media assets, and print marketing graphics by Kodraxelsoft.",
    detailProblemTitle: "Graphic Design & Brand Identity Built for Business Impact",
    detailProblemIntro:
      "Eliminate generic templates and amateur visuals that hurt your brand authority. We build cohesive visual identity systems that help your business stand out in competitive markets and command premium prices.",
    detailSolutionTitle: "Complete Visual Solutions Delivered Ready to Use",
    detailSolutionIntro:
      "Our design team provides organized visual asset packages formatted for both high-resolution printing and optimized digital use.",
    ctaTitle: "Ready to Start Your Graphic Design Project?",
    ctaBody:
      "Book a free 15-minute discovery call with our design architects to plan your brand identity launch within 24 hours.",
  },
  {
    id: "software-maintenance-support",
    slug: "software-maintenance-support",
    iconName: "ShieldCheck",
    title: "Software Maintenance & Support",
    subtitle: "Keeping Your Systems Safe & Active",
    description:
      "24/7 server monitoring, security updates, and instant bug fixes so your business software stays fast, secure, and protected at all times.",
    features: [
      "Monthly Framework & Bug Fixes: Regular core system updates, plugin patches, and rapid bug resolutions to keep software healthy.",
      "Cloud Security Checks & Hardening: Continuous vulnerability scanning, firewall configuration, and SSL management to block cyber threats.",
      "Automated Data Backups & Disaster Recovery: Scheduled daily offsite database backups to guarantee rapid system restoration whenever needed.",
      "24/7 Uptime Monitoring & Rapid Response: Real-time infrastructure tracking to detect and fix server issues before your customers notice.",
    ],
    deliverables: [
      "Detailed Monthly Maintenance Reports: Clear executive summaries detailing update logs, security status, and system performance metrics.",
      "Comprehensive Security & Backup Checklist: Routine multi-point audits ensuring your web assets comply with modern web security standards.",
      "Dedicated Priority Support Channel: Direct access to senior developers via private chat or ticketing system for urgent technical queries.",
      "Clear SLA Response Times: Guaranteed quick turnaround times for emergency server repairs and critical application hotfixes.",
    ],
    basePrice: "Custom Quote",
    estimatedWeeks: "Ongoing",
    technologies: ["AWS / Vercel", "Monitoring Tools", "Cloud Backups", "Security Audits"],
    metaTitle: "Custom Software Maintenance & Support Services | Kodraxelsoft",
    metaDescription:
      "Protect your applications with 24/7 server monitoring, cloud security updates, automated backups, and guaranteed SLA support by Kodraxelsoft.",
    detailProblemTitle: "Software Maintenance & Support Built for Total Peace of Mind",
    detailProblemIntro:
      "Prevent costly website outages, unexpected security breaches, and performance slow-downs. We provide proactive monitoring and ongoing technical maintenance so your core digital systems run smoothly without interruption.",
    detailSolutionTitle: "Transparent Maintenance Solutions Built for Reliability",
    detailSolutionIntro:
      "We operate as your dedicated technical operations team, delivering consistent health reports and immediate emergency fixes under clear response timelines.",
    ctaTitle: "Ready to Start Your Software Maintenance Project?",
    ctaBody:
      "Book a free 15-minute discovery call with our infrastructure leads to set up your support SLA within 24 hours.",
    detailMiddleBadge: "Ongoing Support",
    detailScopeBadge: "Fixed SLA Agreement",
  },
];
