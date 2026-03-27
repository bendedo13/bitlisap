import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';
import { Request, Response, NextFunction } from 'express';

if (
  config.CLOUDINARY_CLOUD_NAME &&
  config.CLOUDINARY_API_KEY &&
  config.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
  });
}

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyalari yuklenebilir'));
    }
  },
});

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: `bitlis-sehrim/${folder}` },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Upload basarisiz'));
          } else {
            resolve(result.secure_url);
          }
        }
      )
      .end(buffer);
  });
}

export function handleUploadError(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        error: 'Dosya boyutu 5MB sinirini asiyor',
      });
      return;
    }
    res.status(400).json({ error: err.message });
    return;
  }
  if (err.message === 'Sadece resim dosyalari yuklenebilir') {
    res.status(400).json({ error: err.message });
    return;
  }
  next(err);
}
