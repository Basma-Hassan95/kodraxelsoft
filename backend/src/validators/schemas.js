import Joi from 'joi';

const strongPassword = Joi.string()
  .min(10)
  .max(128)
  .pattern(/[A-Z]/)
  .pattern(/[a-z]/)
  .pattern(/[0-9]/)
  .pattern(/[^A-Za-z0-9]/)
  .messages({
    'string.pattern.base':
      'Password must include upper, lower, number, and special character',
    'string.min': 'Password must be at least 10 characters',
  });

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

export const bootstrapAdminSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: strongPassword.required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: strongPassword.required(),
});

export const heroSchema = Joi.object({
  title: Joi.string().required(),
  subtitle: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  badge_text: Joi.string().allow('', null),
  highlight_text: Joi.string().allow('', null),
  cta_buttons: Joi.array().items(
    Joi.object({
      label: Joi.string().required(),
      href: Joi.string().required(),
      variant: Joi.string().allow('', null),
    })
  ).default([]),
  background_image: Joi.string().allow('', null),
  hero_image: Joi.string().allow('', null),
  is_active: Joi.boolean().default(true),
});

export const serviceSchema = Joi.object({
  title: Joi.string().required(),
  subtitle: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  icon: Joi.string().allow('', null),
  image_url: Joi.string().allow('', null),
  features: Joi.array().items(Joi.string()).default([]),
  deliverables: Joi.array().items(Joi.string()).default([]),
  technologies: Joi.array().items(Joi.string()).default([]),
  button_text: Joi.string().allow('', null),
  button_link: Joi.string().allow('', null),
  base_price: Joi.string().allow('', null),
  estimated_weeks: Joi.string().allow('', null),
  display_order: Joi.number().integer().default(0),
  is_enabled: Joi.boolean().default(true),
  slug: Joi.string().allow('', null),
});

export const projectSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().allow('', null),
  technologies: Joi.array().items(Joi.string()).default([]),
  description: Joi.string().allow('', null),
  tagline: Joi.string().allow('', null),
  challenge: Joi.string().allow('', null),
  solution: Joi.string().allow('', null),
  impact_metrics: Joi.array().items(
    Joi.object({
      label: Joi.string().required(),
      value: Joi.string().required(),
    })
  ).default([]),
  images: Joi.array().items(Joi.string()).default([]),
  cover_image: Joi.string().allow('', null),
  live_url: Joi.string().allow('', null),
  github_url: Joi.string().allow('', null),
  client_name: Joi.string().allow('', null),
  completion_date: Joi.date().iso().allow(null),
  year: Joi.string().allow('', null),
  status: Joi.string().valid('draft', 'published', 'archived').default('published'),
  is_featured: Joi.boolean().default(false),
  display_order: Joi.number().integer().default(0),
  slug: Joi.string().allow('', null),
});

export const metaAdSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().allow('', null),
  image_url: Joi.string().allow('', null),
  cta_text: Joi.string().allow('', null),
  link: Joi.string().allow('', null),
  status: Joi.string().valid('active', 'inactive', 'draft').default('active'),
  display_order: Joi.number().integer().default(0),
  // Optional (migration 005). stripUnknown keeps them out unless sent.
  channel: Joi.string()
    .valid('LinkedIn', 'Instagram', 'Meta / Facebook', 'Other')
    .empty('')
    .optional(),
  badge: Joi.string().allow('', null).empty('').optional(),
});

export const testimonialSchema = Joi.object({
  client_name: Joi.string().required(),
  company: Joi.string().allow('', null),
  position: Joi.string().allow('', null),
  review: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).default(5),
  profile_image: Joi.string().allow('', null),
  display_order: Joi.number().integer().default(0),
  is_enabled: Joi.boolean().default(true),
});

export const orderCreateSchema = Joi.object({
  client_name: Joi.string().required(),
  client_email: Joi.string().email().required(),
  client_phone: Joi.string().allow('', null),
  client_company: Joi.string().allow('', null),
  project_type: Joi.string().allow('', null),
  budget: Joi.string().allow('', null),
  details: Joi.string().allow('', null),
  metadata: Joi.object().default({}),
});

export const orderUpdateSchema = Joi.object({
  client_name: Joi.string(),
  client_email: Joi.string().email(),
  client_phone: Joi.string().allow('', null),
  client_company: Joi.string().allow('', null),
  project_type: Joi.string().allow('', null),
  budget: Joi.string().allow('', null),
  details: Joi.string().allow('', null),
  status: Joi.string().valid('pending', 'in_progress', 'completed', 'delivered', 'cancelled'),
  notes: Joi.string().allow('', null),
  metadata: Joi.object(),
}).min(1);

export const orderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'in_progress', 'completed', 'delivered', 'cancelled')
    .required(),
});

export const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  company: Joi.string().allow('', null),
  subject: Joi.string().allow('', null),
  message: Joi.string().required(),
  metadata: Joi.object().default({}),
});

export const settingsSchema = Joi.object({
  company_name: Joi.string(),
  logo_url: Joi.string().allow('', null),
  favicon_url: Joi.string().allow('', null),
  email: Joi.string().email().allow('', null),
  phone: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
  google_maps_url: Joi.string().allow('', null),
  social_links: Joi.object(),
  seo_defaults: Joi.object(),
  footer_info: Joi.string().allow('', null),
  copyright_text: Joi.string().allow('', null),
  business_hours: Joi.object(),
  extra: Joi.object(),
}).min(1);

export const seoSchema = Joi.object({
  page_key: Joi.string().required(),
  page_path: Joi.string().required(),
  meta_title: Joi.string().allow('', null),
  meta_description: Joi.string().allow('', null),
  meta_keywords: Joi.string().allow('', null),
  og_image: Joi.string().allow('', null),
  canonical_url: Joi.string().allow('', null),
});

export const blogSchema = Joi.object({
  slug: Joi.string().required(),
  title: Joi.string().required(),
  excerpt: Joi.string().allow('', null),
  category: Joi.string().allow('', null),
  author_name: Joi.string().allow('', null),
  author_role: Joi.string().allow('', null),
  author_avatar: Joi.string().allow('', null),
  published_date: Joi.date().iso().allow(null),
  read_time: Joi.string().allow('', null),
  image_url: Joi.string().allow('', null),
  content: Joi.array().items(Joi.string()).default([]),
  is_featured: Joi.boolean().default(false),
  is_published: Joi.boolean().default(true),
});

export const careerSchema = Joi.object({
  title: Joi.string().required(),
  department: Joi.string().allow('', null),
  type: Joi.string().allow('', null),
  location: Joi.string().allow('', null),
  salary: Joi.string().allow('', null),
  description: Joi.string().allow('', null),
  requirements: Joi.array().items(Joi.string()).default([]),
  is_active: Joi.boolean().default(true),
  display_order: Joi.number().integer().default(0),
});

export const reorderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().uuid().required(),
        display_order: Joi.number().integer().required(),
      })
    )
    .min(1)
    .required(),
});

export const trackVisitSchema = Joi.object({
  session_id: Joi.string().max(120).allow('', null),
  page_path: Joi.string().max(500).default('/'),
  page_title: Joi.string().max(300).allow('', null),
  referrer: Joi.string().max(1000).allow('', null),
  user_agent: Joi.string().max(1000).allow('', null),
  country: Joi.string().max(100).allow('', null),
  city: Joi.string().max(100).allow('', null),
  metadata: Joi.object().default({}),
});

export const publicReviewSchema = Joi.object({
  client_name: Joi.string().min(2).max(120).required(),
  company: Joi.string().max(160).allow('', null),
  position: Joi.string().max(120).allow('', null),
  review: Joi.string().min(10).max(2000).required(),
  rating: Joi.number().integer().min(1).max(5).default(5),
  profile_image: Joi.string().allow('', null),
});

export const moderateReviewSchema = Joi.object({
  approve: Joi.boolean().required(),
});

export const mediaRegisterSchema = Joi.object({
  filename: Joi.string().trim().min(1).required(),
  url: Joi.string().trim().min(1).required(),
  media_type: Joi.string().valid('image', 'video', 'document', 'other').default('image'),
  folder: Joi.string().allow('', null).default('external'),
  alt_text: Joi.string().allow('', null),
  original_name: Joi.string().allow('', null),
});

export const jobApplicationSchema = Joi.object({
  career_id: Joi.string().uuid().allow(null, ''),
  career_title: Joi.string().trim().min(1).required(),
  applicant_name: Joi.string().trim().min(2).max(120).required(),
  applicant_email: Joi.string().email().required(),
  phone: Joi.string().trim().min(7).max(40).required(),
  address: Joi.string().trim().allow('', null).max(300),
  city: Joi.string().trim().allow('', null).max(120),
  country: Joi.string().trim().allow('', null).max(120),
  portfolio_url: Joi.string().trim().allow('', null).max(500),
  github_url: Joi.string().trim().allow('', null).max(500),
  linkedin_url: Joi.string().trim().allow('', null).max(500),
  years_experience: Joi.string().trim().allow('', null).max(60),
  current_position: Joi.string().trim().allow('', null).max(160),
  current_salary: Joi.string().trim().allow('', null).max(120),
  expected_salary: Joi.string().trim().allow('', null).max(120),
  notice_period: Joi.string().trim().allow('', null).max(120),
  cover_note: Joi.string().trim().allow('', null).max(8000),
  cv_url: Joi.string().trim().allow('', null).max(1000),
  cv_filename: Joi.string().trim().allow('', null).max(255),
});

export const jobApplicationStatusSchema = Joi.object({
  status: Joi.string()
    .valid('new', 'reviewing', 'interview', 'hired', 'rejected')
    .required(),
});
