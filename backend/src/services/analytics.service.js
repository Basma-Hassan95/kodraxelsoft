import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination, buildMeta } from '../utils/pagination.js';
import { logActivity } from '../utils/helpers.js';

function hashValue(value = '') {
  return crypto.createHash('sha256').update(String(value)).digest('hex').slice(0, 32);
}

function detectDevice(userAgent = '') {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) return 'mobile';
  if (/ipad|tablet/i.test(ua)) return 'tablet';
  return 'desktop';
}

function detectBrowser(userAgent = '') {
  const ua = userAgent.toLowerCase();
  if (ua.includes('edg/')) return 'Edge';
  if (ua.includes('chrome/')) return 'Chrome';
  if (ua.includes('firefox/')) return 'Firefox';
  if (ua.includes('safari/') && !ua.includes('chrome/')) return 'Safari';
  return 'Other';
}

function detectOs(userAgent = '') {
  const ua = userAgent.toLowerCase();
  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('mac os') || ua.includes('macintosh')) return 'macOS';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) return 'iOS';
  if (ua.includes('linux')) return 'Linux';
  return 'Other';
}

function startOfDayISO(date = new Date()) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function dateKeyUTC(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export const analyticsService = {
  async trackVisit(payload, reqMeta = {}) {
    const sessionId = payload.session_id || crypto.randomUUID();
    const pagePath = payload.page_path || '/';
    const userAgent = payload.user_agent || reqMeta.userAgent || '';
    const ip = reqMeta.ip || '';
    const visitorHash = hashValue(`${sessionId}:${ip || userAgent}`);
    const ipHash = ip ? hashValue(ip) : null;
    const todayStart = startOfDayISO();

    const { count: existingToday, error: uniqueError } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .eq('visitor_hash', visitorHash)
      .gte('created_at', todayStart);

    if (uniqueError) throw new ApiError(500, uniqueError.message);

    const isUniqueDaily = (existingToday || 0) === 0;

    const row = {
      session_id: sessionId,
      visitor_hash: visitorHash,
      page_path: pagePath,
      page_title: payload.page_title || null,
      referrer: payload.referrer || reqMeta.referrer || null,
      user_agent: userAgent || null,
      device_type: detectDevice(userAgent),
      browser: detectBrowser(userAgent),
      os: detectOs(userAgent),
      country: payload.country || null,
      city: payload.city || null,
      ip_hash: ipHash,
      is_unique_daily: isUniqueDaily,
      metadata: payload.metadata || {},
    };

    const { data, error } = await supabase.from('page_views').insert(row).select('*').single();
    if (error) throw new ApiError(400, error.message);

    await this.bumpDailyStats(isUniqueDaily);

    return {
      tracked: true,
      session_id: sessionId,
      is_unique_daily: isUniqueDaily,
      view_id: data.id,
    };
  },

  async bumpDailyStats(isUniqueDaily) {
    const today = dateKeyUTC();
    const { data: existing } = await supabase
      .from('visitor_daily_stats')
      .select('*')
      .eq('stat_date', today)
      .maybeSingle();

    if (!existing) {
      await supabase.from('visitor_daily_stats').insert({
        stat_date: today,
        total_views: 1,
        unique_visitors: isUniqueDaily ? 1 : 0,
      });
      return;
    }

    await supabase
      .from('visitor_daily_stats')
      .update({
        total_views: (existing.total_views || 0) + 1,
        unique_visitors: (existing.unique_visitors || 0) + (isUniqueDaily ? 1 : 0),
        updated_at: new Date().toISOString(),
      })
      .eq('stat_date', today);
  },

  async getSummary() {
    const now = new Date();
    const todayStart = startOfDayISO(now);
    const weekStart = new Date(now);
    weekStart.setUTCDate(weekStart.getUTCDate() - 6);
    weekStart.setUTCHours(0, 0, 0, 0);
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    const countSince = async (since, uniqueOnly = false) => {
      let q = supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', since);
      if (uniqueOnly) q = q.eq('is_unique_daily', true);
      const { count, error } = await q;
      if (error) throw new ApiError(500, error.message);
      return count || 0;
    };

    const [
      totalViews,
      totalUniqueDays,
      todayViews,
      todayUnique,
      weekViews,
      weekUnique,
      monthViews,
      monthUnique,
    ] = await Promise.all([
      countSince('1970-01-01T00:00:00.000Z'),
      countSince('1970-01-01T00:00:00.000Z', true),
      countSince(todayStart),
      countSince(todayStart, true),
      countSince(weekStart.toISOString()),
      countSince(weekStart.toISOString(), true),
      countSince(monthStart.toISOString()),
      countSince(monthStart.toISOString(), true),
    ]);

    return {
      totalViews,
      totalUniqueVisitorsApprox: totalUniqueDays,
      today: { views: todayViews, uniqueVisitors: todayUnique },
      last7Days: { views: weekViews, uniqueVisitors: weekUnique },
      thisMonth: { views: monthViews, uniqueVisitors: monthUnique },
    };
  },

  async getDailyStats(days = 30) {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - (days - 1));
    since.setUTCHours(0, 0, 0, 0);
    const sinceKey = dateKeyUTC(since);

    const { data, error } = await supabase
      .from('visitor_daily_stats')
      .select('*')
      .gte('stat_date', sinceKey)
      .order('stat_date', { ascending: true });

    if (error) throw new ApiError(500, error.message);

    const byDate = {};
    for (const row of data || []) {
      byDate[row.stat_date] = {
        stat_date: row.stat_date,
        total_views: Number(row.total_views || 0),
        unique_visitors: Number(row.unique_visitors || 0),
      };
    }

    // Fallback: aggregate from page_views when daily rollup is empty
    const hasAny = Object.keys(byDate).length > 0;
    if (!hasAny) {
      const { data: views, error: viewsError } = await supabase
        .from('page_views')
        .select('created_at, is_unique_daily')
        .gte('created_at', since.toISOString());
      if (viewsError) throw new ApiError(500, viewsError.message);
      for (const v of views || []) {
        const key = String(v.created_at).slice(0, 10);
        if (!byDate[key]) {
          byDate[key] = { stat_date: key, total_views: 0, unique_visitors: 0 };
        }
        byDate[key].total_views += 1;
        if (v.is_unique_daily) byDate[key].unique_visitors += 1;
      }
    }

    const filled = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setUTCDate(since.getUTCDate() + i);
      const key = dateKeyUTC(d);
      filled.push(
        byDate[key] || { stat_date: key, total_views: 0, unique_visitors: 0 }
      );
    }
    return filled;
  },

  async getTopPages(limit = 10) {
    const { data, error } = await supabase
      .from('page_views')
      .select('page_path')
      .order('created_at', { ascending: false })
      .limit(2000);

    if (error) throw new ApiError(500, error.message);

    const counts = {};
    for (const row of data || []) {
      const key = row.page_path || '/';
      counts[key] = (counts[key] || 0) + 1;
    }

    return Object.entries(counts)
      .map(([page_path, views]) => ({ page_path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  },

  async listVisits(query = {}) {
    const { page, limit, from, to } = getPagination(query);
    let q = supabase.from('page_views').select('*', { count: 'exact' });

    if (query.page_path) q = q.eq('page_path', query.page_path);
    if (query.device_type) q = q.eq('device_type', query.device_type);
    if (query.search) {
      const term = query.search.trim();
      q = q.or(`page_path.ilike.%${term}%,referrer.ilike.%${term}%,browser.ilike.%${term}%`);
    }
    if (query.from) q = q.gte('created_at', query.from);
    if (query.to) q = q.lte('created_at', query.to);

    const { data, error, count } = await q.order('created_at', { ascending: false }).range(from, to);
    if (error) throw new ApiError(500, error.message);

    return {
      data: data || [],
      meta: buildMeta({ page, limit, total: count || 0 }),
    };
  },

  async getOverview() {
    const [summary, daily, topPages, recentVisits] = await Promise.all([
      this.getSummary(),
      this.getDailyStats(14),
      this.getTopPages(8),
      this.listVisits({ page: 1, limit: 10 }),
    ]);

    return {
      summary,
      daily,
      topPages,
      recentVisits: recentVisits.data,
    };
  },
};

export const notificationsService = {
  async getInbox() {
    const [
      unreadMessages,
      pendingReviews,
      pendingOrders,
      pendingApplications,
      latestMessages,
      latestReviews,
      latestOrders,
      latestApplications,
      visitorSummary,
    ] = await Promise.all([
      countExact('contact_messages', (q) => q.eq('is_read', false)),
      countExact('testimonials', (q) => q.eq('is_approved', false)),
      countExact('orders', (q) => q.eq('status', 'pending')),
      countExact('job_applications', (q) => q.eq('status', 'new')),
      supabase
        .from('contact_messages')
        .select('id, name, email, subject, message, is_read, created_at')
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(25),
      supabase
        .from('testimonials')
        .select('id, client_name, company, review, rating, source, is_approved, created_at')
        .eq('is_approved', false)
        .order('created_at', { ascending: false })
        .limit(25),
      supabase
        .from('orders')
        .select(
          'id, order_number, client_name, client_email, client_company, project_type, budget, status, created_at'
        )
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(40),
      supabase
        .from('job_applications')
        .select(
          'id, career_title, applicant_name, applicant_email, phone, portfolio_url, github_url, linkedin_url, cv_url, status, created_at'
        )
        .eq('status', 'new')
        .order('created_at', { ascending: false })
        .limit(25),
      analyticsService.getSummary(),
    ]);

    if (latestMessages.error) throw new ApiError(500, latestMessages.error.message);
    if (latestReviews.error) throw new ApiError(500, latestReviews.error.message);
    if (latestOrders.error) throw new ApiError(500, latestOrders.error.message);
    if (latestApplications.error) throw new ApiError(500, latestApplications.error.message);

    return {
      counts: {
        unreadMessages,
        pendingReviews,
        pendingOrders,
        pendingApplications,
        todayVisitors: visitorSummary.today.uniqueVisitors,
        todayViews: visitorSummary.today.views,
      },
      unreadMessages: latestMessages.data || [],
      pendingReviews: latestReviews.data || [],
      pendingOrders: latestOrders.data || [],
      pendingApplications: latestApplications.data || [],
      audience: visitorSummary,
    };
  },
};

async function countExact(table, filterFn) {
  let q = supabase.from(table).select('*', { count: 'exact', head: true });
  if (filterFn) q = filterFn(q);
  const { count, error } = await q;
  if (error) throw new ApiError(500, error.message);
  return count || 0;
}

export async function submitPublicReview(payload) {
  const row = {
    client_name: payload.client_name,
    company: payload.company || null,
    position: payload.position || null,
    review: payload.review,
    rating: payload.rating || 5,
    profile_image: payload.profile_image || null,
    source: 'website',
    is_approved: false,
    is_enabled: false,
    display_order: 0,
  };

  const { data, error } = await supabase.from('testimonials').insert(row).select('*').single();
  if (error) throw new ApiError(400, error.message);

  await logActivity({
    action: 'create',
    entityType: 'testimonial',
    entityId: data.id,
    summary: `New website review from ${data.client_name}`,
  });

  return data;
}

export async function moderateReview(id, { approve }) {
  const { data, error } = await supabase
    .from('testimonials')
    .update({
      is_approved: Boolean(approve),
      is_enabled: Boolean(approve),
    })
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) throw new ApiError(400, error.message);
  if (!data) throw new ApiError(404, 'Review not found');

  await logActivity({
    action: 'status_change',
    entityType: 'testimonial',
    entityId: id,
    summary: approve ? `Approved review by ${data.client_name}` : `Rejected review by ${data.client_name}`,
  });

  return data;
}
