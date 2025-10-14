import express from 'express';
import multer from 'multer';
import { uploadController } from '../../infrastructure/container/uploadContainer';

const upload = multer();
const router = express.Router();

router.post('/profile', upload.single('file'), uploadController.uploadProfile);
router.post('/banner', upload.single('file'), uploadController.uploadBanner);
router.post('/art', upload.single('file'), uploadController.uploadArt);
router.post('/', upload.single('file'), uploadController.uploadImage)
router.post('/delete', uploadController.deleteImage)

export default router;