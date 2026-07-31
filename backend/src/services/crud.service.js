import { supabase } from '../config/supabase.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination, buildMeta } from '../utils/pagination.js';
import { logActivity } from '../utils/helpers.js';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function assertUuid(id, entityName = 'record') {
  if (!UUID_RE.test(String(id || ''))) {
    throw new ApiError(400, `Invalid ${entityName} id. Expected a UUID.`);
  }
}

/**
 * Generic list/get/create/update/remove helpers for Supabase tables.
 */
export class CrudService {
  constructor(table, options = {}) {
    this.table = table;
    this.entityName = options.entityName || table;
    this.searchColumns = options.searchColumns || [];
    this.defaultOrder = options.defaultOrder || { column: 'created_at', ascending: false };
    this.publicFilter = options.publicFilter || null;
  }

  async list(query = {}, { admin = false } = {}) {
    const { page, limit, from, to } = getPagination(query);
    let q = supabase.from(this.table).select('*', { count: 'exact' });

    if (!admin && this.publicFilter) {
      q = this.publicFilter(q);
    }

    if (query.search && this.searchColumns.length) {
      const term = query.search.trim();
      const or = this.searchColumns.map((c) => `${c}.ilike.%${term}%`).join(',');
      q = q.or(or);
    }

    if (query.status) q = q.eq('status', query.status);
    if (query.is_enabled !== undefined) {
      q = q.eq('is_enabled', query.is_enabled === 'true' || query.is_enabled === true);
    }
    if (query.is_featured !== undefined) {
      q = q.eq('is_featured', query.is_featured === 'true' || query.is_featured === true);
    }
    if (query.category) q = q.eq('category', query.category);
    if (query.is_read !== undefined) {
      q = q.eq('is_read', query.is_read === 'true' || query.is_read === true);
    }
    if (query.folder) q = q.eq('folder', query.folder);
    if (query.media_type) q = q.eq('media_type', query.media_type);

    const orderCol = query.sortBy || this.defaultOrder.column;
    const ascending = query.sortOrder
      ? query.sortOrder === 'asc'
      : this.defaultOrder.ascending;

    const { data, error, count } = await q.order(orderCol, { ascending }).range(from, to);
    if (error) throw new ApiError(500, error.message);

    return {
      data: data || [],
      meta: buildMeta({ page, limit, total: count || 0 }),
    };
  }

  async getById(id) {
    assertUuid(id, this.entityName);
    const { data, error } = await supabase.from(this.table).select('*').eq('id', id).maybeSingle();
    if (error) throw new ApiError(400, error.message);
    if (!data) throw new ApiError(404, `${this.entityName} not found`);
    return data;
  }

  async create(payload) {
    const { data, error } = await supabase.from(this.table).insert(payload).select('*').single();
    if (error) throw new ApiError(400, error.message);
    await logActivity({
      action: 'create',
      entityType: this.entityName,
      entityId: data.id,
      summary: `Created ${this.entityName}`,
    });
    return data;
  }

  async update(id, payload) {
    assertUuid(id, this.entityName);
    const { data, error } = await supabase
      .from(this.table)
      .update(payload)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) throw new ApiError(400, error.message);
    if (!data) throw new ApiError(404, `${this.entityName} not found`);
    await logActivity({
      action: 'update',
      entityType: this.entityName,
      entityId: id,
      summary: `Updated ${this.entityName}`,
    });
    return data;
  }

  async remove(id) {
    assertUuid(id, this.entityName);
    const existing = await this.getById(id);
    const { error } = await supabase.from(this.table).delete().eq('id', id);
    if (error) throw new ApiError(400, error.message);
    await logActivity({
      action: 'delete',
      entityType: this.entityName,
      entityId: id,
      summary: `Deleted ${this.entityName}`,
    });
    return existing;
  }
}
