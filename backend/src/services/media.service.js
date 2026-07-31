import { randomUUID } from 'crypto';
import path from 'path';
import { supabase, storageBucket } from '../config/supabase.js';
import { ApiError } from '../utils/ApiError.js';
import { CrudService } from './crud.service.js';
import { logActivity } from '../utils/helpers.js';

function detectMediaType(mime = '') {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime === 'application/pdf') return 'document';
  return 'other';
}

class MediaService extends CrudService {
  constructor() {
    super('media_assets', {
      entityName: 'media',
      searchColumns: ['filename', 'original_name', 'folder'],
      defaultOrder: { column: 'created_at', ascending: false },
    });
  }

  async upload(file, { folder = 'uploads', altText = null } = {}) {
    if (!file) throw new ApiError(400, 'No file provided');

    const ext = path.extname(file.originalname || '') || '';
    const safeFolder = String(folder).replace(/[^a-zA-Z0-9/_-]/g, '') || 'uploads';
    const filename = `${Date.now()}-${randomUUID()}${ext}`;
    const storagePath = `${safeFolder}/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw new ApiError(
        400,
        `Storage upload failed: ${uploadError.message}. Ensure bucket "${storageBucket}" exists (run 003_storage.sql).`
      );
    }

    const { data: publicData } = supabase.storage.from(storageBucket).getPublicUrl(storagePath);

    const record = await this.create({
      filename,
      original_name: file.originalname,
      url: publicData.publicUrl,
      storage_path: storagePath,
      mime_type: file.mimetype,
      size_bytes: file.size,
      media_type: detectMediaType(file.mimetype),
      folder: safeFolder,
      alt_text: altText,
    });

    await logActivity({
      action: 'upload',
      entityType: 'media',
      entityId: record.id,
      summary: `Uploaded ${file.originalname}`,
    });

    return record;
  }

  /** Register an external / public URL without uploading a binary file. */
  async register({
    filename,
    url,
    media_type = 'image',
    folder = 'external',
    alt_text = null,
    original_name = null,
  }) {
    const safeFolder = String(folder || 'external').replace(/[^a-zA-Z0-9/_-]/g, '') || 'external';
    const record = await this.create({
      filename,
      original_name: original_name || filename,
      url,
      storage_path: `external/${randomUUID()}`,
      mime_type: null,
      size_bytes: 0,
      media_type,
      folder: safeFolder,
      alt_text,
    });

    await logActivity({
      action: 'create',
      entityType: 'media',
      entityId: record.id,
      summary: `Registered media URL ${filename}`,
    });

    return record;
  }

  async removeWithStorage(id) {
    const asset = await this.getById(id);
    const pathValue = String(asset.storage_path || '');

    if (pathValue && !pathValue.startsWith('external/')) {
      const { error: storageError } = await supabase.storage
        .from(storageBucket)
        .remove([pathValue]);

      if (storageError) {
        console.warn('[media] storage delete warning:', storageError.message);
      }
    }

    await this.remove(id);
    return asset;
  }

  async listFolders() {
    const { data, error } = await supabase.from('media_assets').select('folder');
    if (error) throw new ApiError(500, error.message);
    const folders = [...new Set((data || []).map((r) => r.folder))].sort();
    return folders;
  }
}

export const mediaService = new MediaService();
