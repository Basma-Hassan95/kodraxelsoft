import { CrudService } from './crud.service.js';
import { supabase } from '../config/supabase.js';
import { ApiError } from '../utils/ApiError.js';
import { slugify, logActivity } from '../utils/helpers.js';

export const heroService = {
  async getActive() {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new ApiError(500, error.message);
    return data;
  },

  async list(query, opts) {
    return new CrudService('hero_banners', {
      entityName: 'hero_banner',
      defaultOrder: { column: 'updated_at', ascending: false },
    }).list(query, opts);
  },

  async getById(id) {
    return new CrudService('hero_banners', { entityName: 'hero_banner' }).getById(id);
  },

  async create(payload) {
    if (payload.is_active) {
      await supabase.from('hero_banners').update({ is_active: false }).eq('is_active', true);
    }
    return new CrudService('hero_banners', { entityName: 'hero_banner' }).create(payload);
  },

  async update(id, payload) {
    if (payload.is_active) {
      await supabase
        .from('hero_banners')
        .update({ is_active: false })
        .eq('is_active', true)
        .neq('id', id);
    }
    return new CrudService('hero_banners', { entityName: 'hero_banner' }).update(id, payload);
  },

  async remove(id) {
    return new CrudService('hero_banners', { entityName: 'hero_banner' }).remove(id);
  },

  async upsertActive(payload) {
    const active = await this.getActive();
    if (active) {
      const updated = await this.update(active.id, { ...payload, is_active: true });
      return updated;
    }
    return this.create({ ...payload, is_active: true });
  },
};

export const servicesService = Object.assign(
  new CrudService('services', {
    entityName: 'service',
    searchColumns: ['title', 'subtitle', 'description'],
    defaultOrder: { column: 'display_order', ascending: true },
    publicFilter: (q) => q.eq('is_enabled', true),
  }),
  {
    async create(payload) {
      const body = {
        ...payload,
        slug: payload.slug || slugify(payload.title),
      };
      return CrudService.prototype.create.call(this, body);
    },
    async reorder(items = []) {
      for (const item of items) {
        const { error } = await supabase
          .from('services')
          .update({ display_order: item.display_order })
          .eq('id', item.id);
        if (error) throw new ApiError(400, error.message);
      }
      await logActivity({
        action: 'update',
        entityType: 'service',
        summary: 'Reordered services',
      });
      return { reordered: items.length };
    },
  }
);

export const projectsService = Object.assign(
  new CrudService('projects', {
    entityName: 'project',
    searchColumns: ['name', 'client_name', 'category', 'description'],
    defaultOrder: { column: 'display_order', ascending: true },
    publicFilter: (q) => q.eq('status', 'published'),
  }),
  {
    async create(payload) {
      const body = {
        ...payload,
        slug: payload.slug || slugify(payload.name),
      };
      return CrudService.prototype.create.call(this, body);
    },
    async reorder(items = []) {
      for (const item of items) {
        const { error } = await supabase
          .from('projects')
          .update({ display_order: item.display_order })
          .eq('id', item.id);
        if (error) throw new ApiError(400, error.message);
      }
      await logActivity({
        action: 'update',
        entityType: 'project',
        summary: 'Reordered projects',
      });
      return { reordered: items.length };
    },
  }
);

export const metaAdsService = Object.assign(
  new CrudService('meta_ads', {
    entityName: 'meta_ad',
    searchColumns: ['title', 'description'],
    defaultOrder: { column: 'display_order', ascending: true },
    publicFilter: (q) => q.eq('status', 'active'),
  }),
  {
    _coreFields(payload = {}) {
      return {
        title: payload.title,
        description: payload.description ?? null,
        image_url: payload.image_url ?? null,
        cta_text: payload.cta_text ?? null,
        link: payload.link ?? null,
        status: payload.status || 'active',
        display_order: Number.isFinite(Number(payload.display_order))
          ? Number(payload.display_order)
          : 0,
      };
    },
    _withExtras(payload = {}) {
      const row = this._coreFields(payload);
      if (payload.channel != null && payload.channel !== '') row.channel = payload.channel;
      if (payload.badge != null && payload.badge !== '') row.badge = payload.badge;
      return row;
    },
    _isMissingColumnError(err) {
      const msg = String(err?.message || err || '');
      return /channel|badge|schema cache|could not find/i.test(msg);
    },
    async create(payload) {
      const full = this._withExtras(payload);
      try {
        return await CrudService.prototype.create.call(this, full);
      } catch (err) {
        if (!this._isMissingColumnError(err)) throw err;
        // Migration 005 not applied — save without channel/badge
        return CrudService.prototype.create.call(this, this._coreFields(payload));
      }
    },
    async update(id, payload) {
      const full = this._withExtras(payload);
      try {
        return await CrudService.prototype.update.call(this, id, full);
      } catch (err) {
        if (!this._isMissingColumnError(err)) throw err;
        return CrudService.prototype.update.call(this, id, this._coreFields(payload));
      }
    },
  }
);

export const testimonialsService = new CrudService('testimonials', {
  entityName: 'testimonial',
  searchColumns: ['client_name', 'company', 'review'],
  defaultOrder: { column: 'display_order', ascending: true },
  publicFilter: (q) => q.eq('is_enabled', true).eq('is_approved', true),
});

export const ordersService = Object.assign(
  new CrudService('orders', {
    entityName: 'order',
    searchColumns: ['client_name', 'client_email', 'client_company', 'project_type', 'order_number'],
    defaultOrder: { column: 'created_at', ascending: false },
  }),
  {
    async updateStatus(id, status) {
      const updated = await this.update(id, { status });
      await logActivity({
        action: 'status_change',
        entityType: 'order',
        entityId: id,
        summary: `Order status → ${status}`,
      });
      return updated;
    },
  }
);

export const contactService = Object.assign(
  new CrudService('contact_messages', {
    entityName: 'contact_message',
    searchColumns: ['name', 'email', 'subject', 'message', 'company'],
    defaultOrder: { column: 'created_at', ascending: false },
  }),
  {
    async markRead(id, is_read = true) {
      return this.update(id, { is_read });
    },
    async markAllRead() {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('is_read', false);
      if (error) throw new ApiError(400, error.message);
      return { success: true };
    },
  }
);

export const settingsService = {
  async get() {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new ApiError(500, error.message);
    return data;
  },

  async update(payload) {
    const current = await this.get();
    if (!current) {
      const { data, error } = await supabase
        .from('website_settings')
        .insert(payload)
        .select('*')
        .single();
      if (error) throw new ApiError(400, error.message);
      await logActivity({
        action: 'create',
        entityType: 'settings',
        entityId: data.id,
        summary: 'Created website settings',
      });
      return data;
    }

    const { data, error } = await supabase
      .from('website_settings')
      .update(payload)
      .eq('id', current.id)
      .select('*')
      .single();
    if (error) throw new ApiError(400, error.message);
    await logActivity({
      action: 'update',
      entityType: 'settings',
      entityId: data.id,
      summary: 'Updated website settings',
    });
    return data;
  },
};

export const seoService = Object.assign(
  new CrudService('seo_pages', {
    entityName: 'seo_page',
    searchColumns: ['page_key', 'page_path', 'meta_title'],
    defaultOrder: { column: 'page_key', ascending: true },
  }),
  {
    async getByKey(pageKey) {
      const { data, error } = await supabase
        .from('seo_pages')
        .select('*')
        .eq('page_key', pageKey)
        .maybeSingle();
      if (error) throw new ApiError(500, error.message);
      if (!data) throw new ApiError(404, 'SEO page not found');
      return data;
    },
    async getByPath(pagePath) {
      const { data, error } = await supabase
        .from('seo_pages')
        .select('*')
        .eq('page_path', pagePath)
        .maybeSingle();
      if (error) throw new ApiError(500, error.message);
      return data;
    },
    async upsert(payload) {
      const { data, error } = await supabase
        .from('seo_pages')
        .upsert(payload, { onConflict: 'page_key' })
        .select('*')
        .single();
      if (error) throw new ApiError(400, error.message);
      await logActivity({
        action: 'update',
        entityType: 'seo_page',
        entityId: data.id,
        summary: `Upserted SEO for ${data.page_key}`,
      });
      return data;
    },
  }
);

export const blogService = Object.assign(
  new CrudService('blog_posts', {
    entityName: 'blog_post',
    searchColumns: ['title', 'excerpt', 'category', 'slug'],
    defaultOrder: { column: 'created_at', ascending: false },
    publicFilter: (q) => q.eq('is_published', true),
  }),
  {
    async getBySlug(slug) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw new ApiError(500, error.message);
      if (!data) throw new ApiError(404, 'Blog post not found');
      return data;
    },
  }
);

export const careersService = new CrudService('careers', {
  entityName: 'career',
  searchColumns: ['title', 'department', 'location'],
  defaultOrder: { column: 'created_at', ascending: false },
  publicFilter: (q) => q.eq('is_active', true),
});

export const jobApplicationsService = Object.assign(
  new CrudService('job_applications', {
    entityName: 'job_application',
    searchColumns: [
      'applicant_name',
      'applicant_email',
      'career_title',
      'phone',
      'city',
      'country',
    ],
    defaultOrder: { column: 'created_at', ascending: false },
  }),
  {
    async submitPublic(payload) {
      const careerId =
        payload.career_id && String(payload.career_id).trim()
          ? payload.career_id
          : null;
      const row = {
        career_id: careerId,
        career_title: payload.career_title,
        applicant_name: payload.applicant_name,
        applicant_email: String(payload.applicant_email || '').toLowerCase(),
        phone: payload.phone || null,
        address: payload.address || null,
        city: payload.city || null,
        country: payload.country || null,
        portfolio_url: payload.portfolio_url || null,
        github_url: payload.github_url || null,
        linkedin_url: payload.linkedin_url || null,
        years_experience: payload.years_experience || null,
        current_position: payload.current_position || null,
        current_salary: payload.current_salary || null,
        expected_salary: payload.expected_salary || null,
        notice_period: payload.notice_period || null,
        cover_note: payload.cover_note || null,
        cv_url: payload.cv_url || null,
        cv_filename: payload.cv_filename || null,
        status: 'new',
      };
      const { data, error } = await supabase
        .from('job_applications')
        .insert(row)
        .select('*')
        .single();
      if (error) throw new ApiError(400, error.message);
      await logActivity({
        action: 'create',
        entityType: 'job_application',
        entityId: data.id,
        summary: `New application: ${data.applicant_name} → ${data.career_title}`,
      });
      return data;
    },
    async updateStatus(id, status) {
      const updated = await this.update(id, { status });
      await logActivity({
        action: 'status_change',
        entityType: 'job_application',
        entityId: id,
        summary: `Application status → ${status}`,
      });
      return updated;
    },
  }
);
