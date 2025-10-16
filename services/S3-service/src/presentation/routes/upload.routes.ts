import multer from "multer";
import express from "express";
import { TYPES } from "../../infrastructure/inversify/types";
import { IUploadController } from "../interface/IUploadController";
import { container } from "../../infrastructure/inversify/inversify.config";

const uploadController = container.get<IUploadController>(
  TYPES.IUploadController
);

const upload = multer();
const router = express.Router();

// router.post('/profile', upload.single('file'), uploadController.uploadProfile);
// router.post('/banner', upload.single('file'), uploadController.uploadBanner);
router.post("/delete", uploadController.deleteImage);
router.post("/", upload.single("file"), uploadController.uploadImage);
router.post("/art", upload.single("file"), uploadController.uploadArt);

export default router;
