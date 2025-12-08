import multer from "multer";
import express from "express";
import { TYPES } from "../../infrastructure/inversify/types";
import { IUploadController } from "../interface/IUploadController";
import { container } from "../../infrastructure/inversify/inversify.config";
import { ROUTES } from "../../constants/routes";

const uploadController = container.get<IUploadController>(
  TYPES.IUploadController
);

const upload = multer();
const router = express.Router();

// router.post(ROUTES.UPLOAD_PROFILE, upload.single('file'), uploadController.uploadProfile);
// router.post(ROUTES.UPLOAD_BANNER, upload.single('file'), uploadController.uploadBanner);
router.post(ROUTES.UPLOAD_DELETE, uploadController.deleteImage);
router.post(ROUTES.UPLOAD_ROOT, upload.single("file"), uploadController.uploadImage);
router.post(ROUTES.UPLOAD_ART, upload.single("file"), uploadController.uploadArt);
router.get(ROUTES.SIGNED_URL, uploadController.getSignedUrl);

export default router;
