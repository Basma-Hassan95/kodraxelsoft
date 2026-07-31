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
  isApproved?: boolean;
  isEnabled?: boolean;
  source?: string;
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

export type JobApplicationStatus =
  | "new"
  | "reviewing"
  | "interview"
  | "hired"
  | "rejected";

export interface JobApplication {
  id: string;
  career_id?: string | null;
  career_title: string;
  applicant_name: string;
  applicant_email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  portfolio_url?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  years_experience?: string | null;
  current_position?: string | null;
  current_salary?: string | null;
  expected_salary?: string | null;
  notice_period?: string | null;
  cover_note?: string | null;
  cv_url?: string | null;
  cv_filename?: string | null;
  status: JobApplicationStatus | string;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

