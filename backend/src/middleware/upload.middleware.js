import multer from 'multer';
import { config } from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';

const storage = multer.memoryStorage();

function fileFilter(_req, file, cb) {
  if (!config.upload.allowedMimeTypes.includes(file.mimetype)) {
    return cb(new ApiError(400, `Unsupported file type: ${file.mimetype}`));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.upload.maxFileSize },
});

const CV_MIMES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

function cvFileFilter(_req, file, cb) {
  if (!CV_MIMES.has(file.mimetype)) {
    return cb(
      new ApiError(400, 'CV must be PDF or Word (.pdf, .doc, .docx)')
    );
  }
  cb(null, true);
}

export const uploadCv = multer({
  storage,
  fileFilter: cvFileFilter,
  limits: { fileSize: config.upload.cvMaxFileSize || 8 * 1024 * 1024 },
});
