import { Router } from 'express';
import { validate } from '../middleware/validate.middleware.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { upload, uploadCv } from '../middleware/upload.middleware.js';
import {
  loginSchema,
  bootstrapAdminSchema,
  changePasswordSchema,
  heroSchema,
  serviceSchema,
  projectSchema,
  metaAdSchema,
  pricingPlanSchema,
  testimonialSchema,
  orderCreateSchema,
  orderUpdateSchema,
  orderStatusSchema,
  contactSchema,
  settingsSchema,
  seoSchema,
  blogSchema,
  careerSchema,
  reorderSchema,
  trackVisitSchema,
  publicReviewSchema,
  moderateReviewSchema,
  mediaRegisterSchema,
  jobApplicationSchema,
  jobApplicationStatusSchema,
  newsletterSubscribeSchema,
} from '../validators/schemas.js';
import {
  authController,
  dashboardController,
  analyticsController,
  reviewsController,
  heroController,
  servicesController,
  projectsController,
  metaAdsController,
  pricingPlansController,
  testimonialsController,
  ordersController,
  contactController,
  settingsController,
  seoController,
  blogController,
  careersController,
  jobApplicationsController,
  mediaController,
  newsletterController,
} from '../controllers/index.js';

const router = Router();

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
router.post('/auth/login', validate(loginSchema), authController.login);
router.post('/auth/logout', authController.logout);
router.post('/auth/bootstrap', validate(bootstrapAdminSchema), authController.bootstrap);
router.get('/auth/me', authenticateAdmin, authController.me);
router.post(
  '/auth/change-password',
  authenticateAdmin,
  validate(changePasswordSchema),
  authController.changePassword
);

// ---------------------------------------------------------------------------
// Public website content
// ---------------------------------------------------------------------------
router.get('/public/hero', heroController.active);
router.get('/public/services', servicesController.list);
router.get('/public/services/:id', servicesController.get);
router.get('/public/projects', projectsController.list);
router.get('/public/projects/:id', projectsController.get);
router.get('/public/meta-ads', metaAdsController.list);
router.get('/public/pricing-plans', pricingPlansController.list);
router.get('/public/testimonials', testimonialsController.list);
router.get('/public/settings', settingsController.get);
router.get('/public/seo', seoController.list);
router.get('/public/seo/:pageKey', seoController.getByKey);
router.get('/public/blog', blogController.list);
router.get('/public/blog/slug/:slug', blogController.getBySlug);
router.get('/public/blog/:id', blogController.get);
router.get('/public/careers', careersController.list);

router.post('/public/contact', validate(contactSchema), contactController.createPublic);
router.post('/public/orders', validate(orderCreateSchema), ordersController.createPublic);
router.post('/public/reviews', validate(publicReviewSchema), reviewsController.submitPublic);
router.post(
  '/public/newsletter',
  validate(newsletterSubscribeSchema),
  newsletterController.subscribePublic
);
router.post(
  '/public/applications',
  validate(jobApplicationSchema),
  jobApplicationsController.submitPublic
);
router.post(
  '/public/applications/cv',
  uploadCv.single('cv'),
  jobApplicationsController.uploadCv
);
router.post('/public/analytics/visit', validate(trackVisitSchema), analyticsController.track);

// ---------------------------------------------------------------------------
// Admin dashboard
// ---------------------------------------------------------------------------
router.get('/admin/dashboard', authenticateAdmin, dashboardController.overview);
router.get('/admin/dashboard/stats', authenticateAdmin, dashboardController.stats);
router.get('/admin/dashboard/inbox', authenticateAdmin, dashboardController.inbox);

// Audience / visitors
router.get('/admin/analytics', authenticateAdmin, analyticsController.overview);
router.get('/admin/analytics/summary', authenticateAdmin, analyticsController.summary);
router.get('/admin/analytics/visits', authenticateAdmin, analyticsController.list);
router.get('/admin/analytics/top-pages', authenticateAdmin, analyticsController.topPages);
router.get('/admin/analytics/daily', authenticateAdmin, analyticsController.daily);

// Hero
router.get('/admin/hero', authenticateAdmin, heroController.list);
router.get('/admin/hero/active', authenticateAdmin, heroController.active);
router.put('/admin/hero/active', authenticateAdmin, validate(heroSchema), heroController.upsertActive);
router.post('/admin/hero', authenticateAdmin, validate(heroSchema), heroController.create);
router.put('/admin/hero/:id', authenticateAdmin, validate(heroSchema), heroController.update);
router.delete('/admin/hero/:id', authenticateAdmin, heroController.remove);

// Services
router.get('/admin/services', authenticateAdmin, servicesController.list);
router.patch(
  '/admin/services/reorder',
  authenticateAdmin,
  validate(reorderSchema),
  servicesController.reorder
);
router.get('/admin/services/:id', authenticateAdmin, servicesController.get);
router.post('/admin/services', authenticateAdmin, validate(serviceSchema), servicesController.create);
router.put('/admin/services/:id', authenticateAdmin, validate(serviceSchema), servicesController.update);
router.delete('/admin/services/:id', authenticateAdmin, servicesController.remove);

// Projects
router.get('/admin/projects', authenticateAdmin, projectsController.list);
router.patch(
  '/admin/projects/reorder',
  authenticateAdmin,
  validate(reorderSchema),
  projectsController.reorder
);
router.get('/admin/projects/:id', authenticateAdmin, projectsController.get);
router.post('/admin/projects', authenticateAdmin, validate(projectSchema), projectsController.create);
router.put('/admin/projects/:id', authenticateAdmin, validate(projectSchema), projectsController.update);
router.delete('/admin/projects/:id', authenticateAdmin, projectsController.remove);

// Meta Ads
router.get('/admin/meta-ads', authenticateAdmin, metaAdsController.list);
router.get('/admin/meta-ads/:id', authenticateAdmin, metaAdsController.get);
router.post('/admin/meta-ads', authenticateAdmin, validate(metaAdSchema), metaAdsController.create);
router.put('/admin/meta-ads/:id', authenticateAdmin, validate(metaAdSchema), metaAdsController.update);
router.delete('/admin/meta-ads/:id', authenticateAdmin, metaAdsController.remove);

// Pricing Plans
router.get('/admin/pricing-plans', authenticateAdmin, pricingPlansController.list);
router.get('/admin/pricing-plans/:id', authenticateAdmin, pricingPlansController.get);
router.post(
  '/admin/pricing-plans',
  authenticateAdmin,
  validate(pricingPlanSchema),
  pricingPlansController.create
);
router.put(
  '/admin/pricing-plans/:id',
  authenticateAdmin,
  validate(pricingPlanSchema),
  pricingPlansController.update
);
router.delete('/admin/pricing-plans/:id', authenticateAdmin, pricingPlansController.remove);

// Testimonials
router.get('/admin/testimonials', authenticateAdmin, testimonialsController.list);
router.get('/admin/testimonials/:id', authenticateAdmin, testimonialsController.get);
router.post(
  '/admin/testimonials',
  authenticateAdmin,
  validate(testimonialSchema),
  testimonialsController.create
);
router.put(
  '/admin/testimonials/:id',
  authenticateAdmin,
  validate(testimonialSchema),
  testimonialsController.update
);
router.patch(
  '/admin/testimonials/:id/moderate',
  authenticateAdmin,
  validate(moderateReviewSchema),
  reviewsController.moderate
);
router.delete('/admin/testimonials/:id', authenticateAdmin, testimonialsController.remove);

// Orders
router.get('/admin/orders', authenticateAdmin, ordersController.list);
router.get('/admin/orders/:id', authenticateAdmin, ordersController.get);
router.put('/admin/orders/:id', authenticateAdmin, validate(orderUpdateSchema), ordersController.update);
router.patch(
  '/admin/orders/:id/status',
  authenticateAdmin,
  validate(orderStatusSchema),
  ordersController.updateStatus
);
router.delete('/admin/orders/:id', authenticateAdmin, ordersController.remove);

// Contact messages
router.get('/admin/messages', authenticateAdmin, contactController.list);
router.patch('/admin/messages/mark-all-read', authenticateAdmin, contactController.markAllRead);
router.get('/admin/messages/:id', authenticateAdmin, contactController.get);
router.patch('/admin/messages/:id/read', authenticateAdmin, contactController.markRead);
router.patch('/admin/messages/:id/unread', authenticateAdmin, contactController.markUnread);
router.delete('/admin/messages/:id', authenticateAdmin, contactController.remove);

// Settings
router.get('/admin/settings', authenticateAdmin, settingsController.get);
router.put('/admin/settings', authenticateAdmin, validate(settingsSchema), settingsController.update);

// SEO
router.get('/admin/seo', authenticateAdmin, seoController.list);
router.get('/admin/seo/:pageKey', authenticateAdmin, seoController.getByKey);
router.post('/admin/seo', authenticateAdmin, validate(seoSchema), seoController.upsert);
router.put('/admin/seo/:id', authenticateAdmin, validate(seoSchema), seoController.update);
router.delete('/admin/seo/:id', authenticateAdmin, seoController.remove);

// Blog
router.get('/admin/blog', authenticateAdmin, blogController.list);
router.get('/admin/blog/:id', authenticateAdmin, blogController.get);
router.post('/admin/blog', authenticateAdmin, validate(blogSchema), blogController.create);
router.put('/admin/blog/:id', authenticateAdmin, validate(blogSchema), blogController.update);
router.delete('/admin/blog/:id', authenticateAdmin, blogController.remove);

// Careers
router.get('/admin/careers', authenticateAdmin, careersController.list);
router.get('/admin/careers/:id', authenticateAdmin, careersController.get);
router.post('/admin/careers', authenticateAdmin, validate(careerSchema), careersController.create);
router.put('/admin/careers/:id', authenticateAdmin, validate(careerSchema), careersController.update);
router.delete('/admin/careers/:id', authenticateAdmin, careersController.remove);

// Job applications (hiring inbox)
router.get('/admin/applications', authenticateAdmin, jobApplicationsController.list);
router.get('/admin/applications/:id', authenticateAdmin, jobApplicationsController.get);
router.patch(
  '/admin/applications/:id/status',
  authenticateAdmin,
  validate(jobApplicationStatusSchema),
  jobApplicationsController.updateStatus
);
router.delete('/admin/applications/:id', authenticateAdmin, jobApplicationsController.remove);

// Media library
router.get('/admin/media', authenticateAdmin, mediaController.list);
router.get('/admin/media/folders', authenticateAdmin, mediaController.folders);
router.post(
  '/admin/media/upload',
  authenticateAdmin,
  upload.single('file'),
  mediaController.upload
);
router.post(
  '/admin/media',
  authenticateAdmin,
  validate(mediaRegisterSchema),
  mediaController.register
);
router.get('/admin/media/:id', authenticateAdmin, mediaController.get);
router.delete('/admin/media/:id', authenticateAdmin, mediaController.remove);

// Newsletter subscribers
router.get('/admin/newsletter', authenticateAdmin, newsletterController.list);
router.get('/admin/newsletter/:id', authenticateAdmin, newsletterController.get);
router.delete('/admin/newsletter/:id', authenticateAdmin, newsletterController.remove);

export default router;
