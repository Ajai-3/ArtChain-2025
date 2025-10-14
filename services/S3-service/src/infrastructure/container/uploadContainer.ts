import { S3FileRepository } from '../repositories/S3FileRepository';

import { UploadProfileImage } from '../../application/usecases/UploadProfileImage';
import { UploadBannerImage } from './../../application/usecases/UploadBannerImage';
import { UploadArtImage } from '../../application/usecases/UploadArtImage';
import { UploadController } from '../../presentation/controllers/UploadController';
import { DeleteImageUseCase } from '../../application/usecases/DeleteImageUseCase';
import { UploadImageUseCase } from '../../application/usecases/UploadImageUseCase';

// Repositories
const s3Repo  = new S3FileRepository();

// Use Cases
const uploadProfileImage = new UploadProfileImage(s3Repo );
const uploadBannerImage = new UploadBannerImage(s3Repo );
const uploadArtImage = new UploadArtImage(s3Repo );
const uploadImageUseCase = new UploadImageUseCase(s3Repo)
const deleteImageUseCase = new DeleteImageUseCase(s3Repo)
// Controller
export const uploadController = new UploadController(
  uploadProfileImage,
  uploadBannerImage,
  uploadArtImage,
  uploadImageUseCase,
  deleteImageUseCase
);
