import { S3FileRepository } from '../repositories/S3FileRepository';

import { UploadProfileImage } from '../../application/usecases/UploadProfileImage';
import { UploadBannerImage } from './../../application/usecases/UploadBannerImage';
import { UploadArtImage } from '../../application/usecases/UploadArtImage';
import { UploadController } from '../../presentation/controllers/UploadController';

// Repositories
const repo = new S3FileRepository();

// Use Cases
const uploadProfileImage = new UploadProfileImage(repo);
const uploadBannerImage = new UploadBannerImage(repo);
const uploadArtImage = new UploadArtImage(repo);
// Controller
export const uploadContainer = new UploadController(
  uploadProfileImage,
  uploadBannerImage,
  uploadArtImage
);
