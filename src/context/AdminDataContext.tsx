"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { servicesData, Service } from "@/data/services";
import { projectsData, Project } from "@/data/projects";
import { blogPosts, BlogPost } from "@/data/blog";

export interface LeadInquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  projectType: string;
  selectedBudget: string;
  projectDetails: string;
  status: "New" | "Contacted" | "In Progress" | "Closed Won" | "Archived";
  createdAt: string;
}

export interface CareerPosition {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  active: boolean;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  role: string;
  company: string;
  review: string;
  rating: number;
  avatar: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  size: string;
  type: "image" | "video";
  uploadedAt: string;
}

export interface SiteSettings {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImageUrl: string;
}

interface AdminDataContextType {
  services: Service[];
  projects: Project[];
  blogPosts: BlogPost[];
  leads: LeadInquiry[];
  careers: CareerPosition[];
  testimonials: TestimonialItem[];
  mediaAssets: MediaAsset[];
  settings: SiteSettings;
  
  // CRUD Handlers
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;

  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;

  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (id: string) => void;

  updateLeadStatus: (id: string, status: LeadInquiry["status"]) => void;
  deleteLead: (id: string) => void;

  addCareer: (career: CareerPosition) => void;
  updateCareer: (career: CareerPosition) => void;
  deleteCareer: (id: string) => void;

  addTestimonial: (item: TestimonialItem) => void;
  updateTestimonial: (item: TestimonialItem) => void;
  deleteTestimonial: (id: string) => void;

  addMediaAsset: (asset: MediaAsset) => void;
  deleteMediaAsset: (id: string) => void;

  updateSettings: (newSettings: SiteSettings) => void;
}

const defaultLeads: LeadInquiry[] = [
  {
    id: "lead-101",
    clientName: "Jonathan Hayes",
    clientEmail: "j.hayes@apexfintech.com",
    clientCompany: "Apex Fintech Partners",
    projectType: "Next.js Web App",
    selectedBudget: "$50,000 - $100,000+",
    projectDetails: "Looking to architect a sub-50ms institutional trading portal with WebGL charts.",
    status: "New",
    createdAt: "2026-07-27 18:42"
  },
  {
    id: "lead-102",
    clientName: "Sarah Lin",
    clientEmail: "slin@biovanguard.org",
    clientCompany: "BioVanguard Research",
    projectType: "AI Model & Multi-Agent",
    selectedBudget: "$30,000 - $50,000",
    projectDetails: "Custom PyTorch RAG vector pipeline for analyzing clinical trial publications.",
    status: "In Progress",
    createdAt: "2026-07-26 14:15"
  },
  {
    id: "lead-103",
    clientName: "David Miller",
    clientEmail: "d.miller@strataloud.io",
    clientCompany: "Strata Cloud Corp",
    projectType: "Cloud Infrastructure",
    selectedBudget: "Custom / Enterprise Scope",
    projectDetails: "Multi-region Kubernetes cluster auto-scaling across AWS and GCP.",
    status: "Closed Won",
    createdAt: "2026-07-25 09:30"
  }
];

const defaultCareers: CareerPosition[] = [
  {
    id: "role-1",
    title: "Senior Principal Next.js Architect",
    department: "Frontend Engineering",
    type: "Full-Time",
    location: "San Francisco, CA / Remote",
    salary: "$180,000 - $240,000",
    description: "Lead the architecture of sub-50ms Next.js 16 App Router platforms with WebGL and GSAP motion.",
    requirements: ["7+ years React/Next.js experience", "Deep TypeScript & WebGL mastery", "Track record of high-scale apps"],
    active: true
  },
  {
    id: "role-2",
    title: "AI Research & PyTorch Engineer",
    department: "Machine Learning Studio",
    type: "Full-Time",
    location: "San Francisco, CA",
    salary: "$190,000 - $250,000",
    description: "Design custom PyTorch RAG pipelines, fine-tune domain LLMs, and optimize vector search latency.",
    requirements: ["PyTorch & CUDA proficiency", "Vector DBs (Pinecone, Qdrant)", "FastAPI production deployment"],
    active: true
  }
];

const defaultTestimonials: TestimonialItem[] = [
  {
    id: "test-1",
    clientName: "Marcus Thorne",
    role: "VP of Engineering",
    company: "Velox Global Capital",
    review: "Kodraxelsoft engineered our high-frequency trading portal in 5 weeks. UI rendering latency dropped by 85% with zero frame stutters.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "test-2",
    clientName: "Elena Rostova",
    role: "Chief Technology Officer",
    company: "Aegis CyberCorp",
    review: "The autonomous AI defense model built by Kodraxelsoft reduced false-positive security alerts by 99.8%. Unbelievable technical precision.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
  }
];

const defaultMediaAssets: MediaAsset[] = [
  { id: "m-1", filename: "video1.mp4", url: "/video1.mp4", size: "1.51 MB", type: "video", uploadedAt: "2026-07-28" },
  { id: "m-2", filename: "video2.mp4", url: "/video2.mp4", size: "1.22 MB", type: "video", uploadedAt: "2026-07-28" },
  { id: "m-3", filename: "ks-emblem.jpg", url: "/ks-emblem.jpg", size: "39.7 KB", type: "image", uploadedAt: "2026-07-26" },
  { id: "m-4", filename: "logo.jpg", url: "/logo.jpg", size: "39.7 KB", type: "image", uploadedAt: "2026-07-26" }
];

const defaultSettings: SiteSettings = {
  companyName: "Kodraxelsoft Inc.",
  contactEmail: "hello@kodraxelsoft.com",
  contactPhone: "+1 (415) 890-4221",
  address: "Market Street, Suite 1400, San Francisco, CA",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://twitter.com",
  metaTitle: "Kodraxelsoft | Ultra-Premium Software Engineering & AI Studio",
  metaDescription: "Elite software architecture laboratory specializing in Next.js web applications, custom AI model integration, and high-scale cloud infrastructure.",
  keywords: "Next.js 16, AI Engineering, Web Architecture, Sub-50ms SLA, Software Studio",
  ogImageUrl: "/logo.png"
};

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(servicesData);
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [blogPostsState, setBlogPostsState] = useState<BlogPost[]>(blogPosts);
  const [leads, setLeads] = useState<LeadInquiry[]>(defaultLeads);
  const [careers, setCareers] = useState<CareerPosition[]>(defaultCareers);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(defaultTestimonials);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(defaultMediaAssets);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  // Services Handlers
  const addService = (service: Service) => setServices((prev) => [service, ...prev]);
  const updateService = (updated: Service) => setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  const deleteService = (id: string) => setServices((prev) => prev.filter((s) => s.id !== id));

  // Projects Handlers
  const addProject = (project: Project) => setProjects((prev) => [project, ...prev]);
  const updateProject = (updated: Project) => setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  const deleteProject = (id: string) => setProjects((prev) => prev.filter((p) => p.id !== id));

  // Blog Handlers
  const addBlogPost = (post: BlogPost) => setBlogPostsState((prev) => [post, ...prev]);
  const updateBlogPost = (updated: BlogPost) => setBlogPostsState((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  const deleteBlogPost = (id: string) => setBlogPostsState((prev) => prev.filter((b) => b.id !== id));

  // Leads CRM Handlers
  const updateLeadStatus = (id: string, status: LeadInquiry["status"]) =>
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  const deleteLead = (id: string) => setLeads((prev) => prev.filter((l) => l.id !== id));

  // Careers Handlers
  const addCareer = (career: CareerPosition) => setCareers((prev) => [career, ...prev]);
  const updateCareer = (updated: CareerPosition) => setCareers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  const deleteCareer = (id: string) => setCareers((prev) => prev.filter((c) => c.id !== id));

  // Testimonials Handlers
  const addTestimonial = (item: TestimonialItem) => setTestimonials((prev) => [item, ...prev]);
  const updateTestimonial = (updated: TestimonialItem) => setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  const deleteTestimonial = (id: string) => setTestimonials((prev) => prev.filter((t) => t.id !== id));

  // Media Handlers
  const addMediaAsset = (asset: MediaAsset) => setMediaAssets((prev) => [asset, ...prev]);
  const deleteMediaAsset = (id: string) => setMediaAssets((prev) => prev.filter((m) => m.id !== id));

  // Settings Handler
  const updateSettings = (newSettings: SiteSettings) => setSettings(newSettings);

  return (
    <AdminDataContext.Provider
      value={{
        services,
        projects,
        blogPosts: blogPostsState,
        leads,
        careers,
        testimonials,
        mediaAssets,
        settings,
        addService,
        updateService,
        deleteService,
        addProject,
        updateProject,
        deleteProject,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        updateLeadStatus,
        deleteLead,
        addCareer,
        updateCareer,
        deleteCareer,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addMediaAsset,
        deleteMediaAsset,
        updateSettings,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) throw new Error("useAdminData must be used within AdminDataProvider");
  return context;
};
