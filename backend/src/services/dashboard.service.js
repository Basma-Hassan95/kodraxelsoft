import { supabase } from '../config/supabase.js';
import { ApiError } from '../utils/ApiError.js';

async function countTable(table, filterFn) {
  let q = supabase.from(table).select('*', { count: 'exact', head: true });
  if (filterFn) q = filterFn(q);
  const { count, error } = await q;
  if (error) throw new ApiError(500, error.message);
  return count || 0;
}

export const dashboardService = {
  async getStats() {
    const [
      totalServices,
      totalProjects,
      totalReviews,
      totalOrders,
      totalMessages,
      unreadMessages,
      pendingOrders,
      pendingReviews,
      totalMetaAds,
      totalMedia,
      totalBlog,
      totalPageViews,
      todayViews,
      pendingApplications,
      totalApplications,
      completedOrders,
    ] = await Promise.all([
      countTable('services'),
      countTable('projects'),
      countTable('testimonials', (q) => q.eq('is_approved', true)),
      countTable('orders'),
      countTable('contact_messages'),
      countTable('contact_messages', (q) => q.eq('is_read', false)),
      countTable('orders', (q) => q.eq('status', 'pending')),
      countTable('testimonials', (q) => q.eq('is_approved', false)),
      countTable('meta_ads'),
      countTable('media_assets'),
      countTable('blog_posts'),
      countTable('page_views'),
      countTable('page_views', (q) => {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        return q.gte('created_at', today.toISOString());
      }),
      countTable('job_applications', (q) => q.eq('status', 'new')).catch(() => 0),
      countTable('job_applications').catch(() => 0),
      countTable('orders', (q) => q.in('status', ['completed', 'delivered'])),
    ]);

    return {
      totalServices,
      totalProjects,
      totalReviews,
      totalOrders,
      totalContactMessages: totalMessages,
      unreadMessages,
      pendingOrders,
      pendingReviews,
      totalMetaAds,
      totalMedia,
      totalBlogPosts: totalBlog,
      totalPageViews,
      todayViews,
      pendingApplications,
      totalApplications,
      completedOrders,
    };
  },

  async getRecentActivity(limit = 15) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new ApiError(500, error.message);
    return data || [];
  },

  async getLatestOrders(limit = 5) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new ApiError(500, error.message);
    return data || [];
  },

  async getLatestMessages(limit = 5) {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw new ApiError(500, error.message);
    return data || [];
  },

  async getOverview() {
    const [stats, recentActivity, latestOrders, latestMessages] = await Promise.all([
      this.getStats(),
      this.getRecentActivity(),
      this.getLatestOrders(),
      this.getLatestMessages(),
    ]);

    return { stats, recentActivity, latestOrders, latestMessages };
  },
};
