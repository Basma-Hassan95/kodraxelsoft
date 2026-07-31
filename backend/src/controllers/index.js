import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authService } from '../services/auth.service.js';
import { config } from '../config/index.js';
import {
  buildSessionCookie,
  clearSessionCookie,
} from '../utils/sessionCookie.js';
import { dashboardService } from '../services/dashboard.service.js';
import { mediaService } from '../services/media.service.js';
import {
  analyticsService,
  notificationsService,
  submitPublicReview,
  moderateReview,
} from '../services/analytics.service.js';
import {
  heroService,
  servicesService,
  projectsService,
  metaAdsService,
  testimonialsService,
  ordersService,
  contactService,
  settingsService,
  seoService,
  blogService,
  careersService,
  jobApplicationsService,
} from '../services/cms.service.js';

export const authController = {
  login: asyncHandler(async (req, res) => {
    const data = await authService.login(req.body, {
      ip: req.ip || req.socket?.remoteAddress,
    });
    const secure = config.isProd || req.secure;
    res.setHeader(
      'Set-Cookie',
      buildSessionCookie({
        token: data.token,
        maxAgeSec: data.maxAgeSec,
        secure,
      })
    );
    return ApiResponse.success(res, {
      message: 'Login successful',
      data: {
        admin: data.admin,
        expiresIn: data.expiresIn,
        maxAgeSec: data.maxAgeSec,
        token: data.token,
      },
    });
  }),
  logout: asyncHandler(async (req, res) => {
    const secure = config.isProd || req.secure;
    res.setHeader('Set-Cookie', clearSessionCookie({ secure }));
    return ApiResponse.success(res, { message: 'Logged out', data: null });
  }),
  me: asyncHandler(async (req, res) => {
    const data = await authService.me(req.admin.id);
    return ApiResponse.success(res, { data });
  }),
  changePassword: asyncHandler(async (req, res) => {
    const data = await authService.changePassword(req.admin.id, req.body);
    return ApiResponse.success(res, { message: data.message, data: null });
  }),
  bootstrap: asyncHandler(async (req, res) => {
    const data = await authService.bootstrapAdmin(req.body, {
      bootstrapKey: req.headers['x-bootstrap-key'],
      ip: req.ip || req.socket?.remoteAddress,
    });
    return ApiResponse.created(res, { message: 'Admin created', data });
  }),
};

export const dashboardController = {
  overview: asyncHandler(async (_req, res) => {
    const data = await dashboardService.getOverview();
    return ApiResponse.success(res, { data });
  }),
  stats: asyncHandler(async (_req, res) => {
    const data = await dashboardService.getStats();
    return ApiResponse.success(res, { data });
  }),
  inbox: asyncHandler(async (_req, res) => {
    const data = await notificationsService.getInbox();
    return ApiResponse.success(res, { data });
  }),
};

export const analyticsController = {
  track: asyncHandler(async (req, res) => {
    const data = await analyticsService.trackVisit(req.body, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      referrer: req.get('referer'),
    });
    return ApiResponse.created(res, { message: 'Visit tracked', data });
  }),
  overview: asyncHandler(async (_req, res) => {
    const data = await analyticsService.getOverview();
    return ApiResponse.success(res, { data });
  }),
  summary: asyncHandler(async (_req, res) => {
    const data = await analyticsService.getSummary();
    return ApiResponse.success(res, { data });
  }),
  list: asyncHandler(async (req, res) => {
    const result = await analyticsService.listVisits(req.query);
    return ApiResponse.success(res, { data: result.data, meta: result.meta });
  }),
  topPages: asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const data = await analyticsService.getTopPages(limit);
    return ApiResponse.success(res, { data });
  }),
  daily: asyncHandler(async (req, res) => {
    const days = Number(req.query.days) || 30;
    const data = await analyticsService.getDailyStats(days);
    return ApiResponse.success(res, { data });
  }),
};

export const reviewsController = {
  submitPublic: asyncHandler(async (req, res) => {
    const data = await submitPublicReview(req.body);
    return ApiResponse.created(res, {
      message: 'Review submitted. Waiting for admin approval.',
      data: {
        id: data.id,
        status: 'pending',
      },
    });
  }),
  moderate: asyncHandler(async (req, res) => {
    const data = await moderateReview(req.params.id, req.body);
    return ApiResponse.success(res, {
      message: req.body.approve ? 'Review approved' : 'Review rejected',
      data,
    });
  }),
};

function makeCrudController(service, { entityLabel = 'Item' } = {}) {
  return {
    list: asyncHandler(async (req, res) => {
      const admin = Boolean(req.admin);
      const result = await service.list(req.query, { admin });
      return ApiResponse.success(res, {
        data: result.data,
        meta: result.meta,
      });
    }),
    get: asyncHandler(async (req, res) => {
      const data = await service.getById(req.params.id);
      return ApiResponse.success(res, { data });
    }),
    create: asyncHandler(async (req, res) => {
      const data = await service.create(req.body);
      return ApiResponse.created(res, { message: `${entityLabel} created`, data });
    }),
    update: asyncHandler(async (req, res) => {
      const data = await service.update(req.params.id, req.body);
      return ApiResponse.success(res, { message: `${entityLabel} updated`, data });
    }),
    remove: asyncHandler(async (req, res) => {
      await service.remove(req.params.id);
      return ApiResponse.success(res, { message: `${entityLabel} deleted`, data: null });
    }),
  };
}

export const heroController = {
  ...makeCrudController(heroService, { entityLabel: 'Hero banner' }),
  active: asyncHandler(async (_req, res) => {
    const data = await heroService.getActive();
    return ApiResponse.success(res, { data });
  }),
  upsertActive: asyncHandler(async (req, res) => {
    const data = await heroService.upsertActive(req.body);
    return ApiResponse.success(res, { message: 'Hero banner saved', data });
  }),
};

export const servicesController = {
  ...makeCrudController(servicesService, { entityLabel: 'Service' }),
  reorder: asyncHandler(async (req, res) => {
    const data = await servicesService.reorder(req.body.items);
    return ApiResponse.success(res, { message: 'Services reordered', data });
  }),
};

export const projectsController = {
  ...makeCrudController(projectsService, { entityLabel: 'Project' }),
  reorder: asyncHandler(async (req, res) => {
    const data = await projectsService.reorder(req.body.items);
    return ApiResponse.success(res, { message: 'Projects reordered', data });
  }),
};

export const metaAdsController = makeCrudController(metaAdsService, { entityLabel: 'Meta ad' });
export const testimonialsController = makeCrudController(testimonialsService, {
  entityLabel: 'Testimonial',
});

export const ordersController = {
  ...makeCrudController(ordersService, { entityLabel: 'Order' }),
  updateStatus: asyncHandler(async (req, res) => {
    const data = await ordersService.updateStatus(req.params.id, req.body.status);
    return ApiResponse.success(res, { message: 'Order status updated', data });
  }),
  createPublic: asyncHandler(async (req, res) => {
    const data = await ordersService.create({ ...req.body, status: 'pending' });
    return ApiResponse.created(res, { message: 'Order received', data });
  }),
};

export const contactController = {
  ...makeCrudController(contactService, { entityLabel: 'Message' }),
  createPublic: asyncHandler(async (req, res) => {
    const data = await contactService.create(req.body);
    return ApiResponse.created(res, {
      message: 'Message received. Admin will see it in dashboard inbox.',
      data: { id: data.id, created_at: data.created_at },
    });
  }),
  markRead: asyncHandler(async (req, res) => {
    const data = await contactService.markRead(req.params.id, true);
    return ApiResponse.success(res, { message: 'Marked as read', data });
  }),
  markUnread: asyncHandler(async (req, res) => {
    const data = await contactService.markRead(req.params.id, false);
    return ApiResponse.success(res, { message: 'Marked as unread', data });
  }),
  markAllRead: asyncHandler(async (_req, res) => {
    await contactService.markAllRead();
    return ApiResponse.success(res, { message: 'All messages marked as read' });
  }),
};

export const settingsController = {
  get: asyncHandler(async (_req, res) => {
    const data = await settingsService.get();
    return ApiResponse.success(res, { data });
  }),
  update: asyncHandler(async (req, res) => {
    const data = await settingsService.update(req.body);
    return ApiResponse.success(res, { message: 'Settings updated', data });
  }),
};

export const seoController = {
  ...makeCrudController(seoService, { entityLabel: 'SEO page' }),
  getByKey: asyncHandler(async (req, res) => {
    const data = await seoService.getByKey(req.params.pageKey);
    return ApiResponse.success(res, { data });
  }),
  upsert: asyncHandler(async (req, res) => {
    const data = await seoService.upsert(req.body);
    return ApiResponse.success(res, { message: 'SEO saved', data });
  }),
};

export const blogController = {
  ...makeCrudController(blogService, { entityLabel: 'Blog post' }),
  getBySlug: asyncHandler(async (req, res) => {
    const data = await blogService.getBySlug(req.params.slug);
    return ApiResponse.success(res, { data });
  }),
};

export const careersController = makeCrudController(careersService, { entityLabel: 'Career' });

export const jobApplicationsController = {
  ...makeCrudController(jobApplicationsService, { entityLabel: 'Job application' }),
  submitPublic: asyncHandler(async (req, res) => {
    const body = { ...req.body };
    if (!body.career_id) body.career_id = null;
    // Normalize empty optional strings
    for (const key of Object.keys(body)) {
      if (typeof body[key] === 'string' && body[key].trim() === '') {
        body[key] = key === 'career_title' || key === 'applicant_name' || key === 'applicant_email' || key === 'phone'
          ? body[key]
          : null;
      }
    }
    const data = await jobApplicationsService.submitPublic(body);
    return ApiResponse.created(res, {
      message: 'Application received. Our hiring team will review it.',
      data: { id: data.id, status: data.status },
    });
  }),
  uploadCv: asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'Please attach a CV file (PDF or Word)');
    const data = await mediaService.upload(req.file, {
      folder: 'applications/cvs',
      altText: 'Job application CV',
    });
    return ApiResponse.created(res, {
      message: 'CV uploaded',
      data: {
        url: data.url,
        filename: data.original_name || data.filename,
        id: data.id,
      },
    });
  }),
  updateStatus: asyncHandler(async (req, res) => {
    const data = await jobApplicationsService.updateStatus(req.params.id, req.body.status);
    return ApiResponse.success(res, { message: 'Application status updated', data });
  }),
};

export const mediaController = {
  list: asyncHandler(async (req, res) => {
    const result = await mediaService.list(req.query, { admin: true });
    return ApiResponse.success(res, { data: result.data, meta: result.meta });
  }),
  get: asyncHandler(async (req, res) => {
    const data = await mediaService.getById(req.params.id);
    return ApiResponse.success(res, { data });
  }),
  upload: asyncHandler(async (req, res) => {
    const data = await mediaService.upload(req.file, {
      folder: req.body.folder || 'uploads',
      altText: req.body.alt_text || null,
    });
    return ApiResponse.created(res, { message: 'File uploaded', data });
  }),
  register: asyncHandler(async (req, res) => {
    const data = await mediaService.register(req.body);
    return ApiResponse.created(res, { message: 'Media registered', data });
  }),
  remove: asyncHandler(async (req, res) => {
    await mediaService.removeWithStorage(req.params.id);
    return ApiResponse.success(res, { message: 'Media deleted', data: null });
  }),
  folders: asyncHandler(async (_req, res) => {
    const data = await mediaService.listFolders();
    return ApiResponse.success(res, { data });
  }),
};
