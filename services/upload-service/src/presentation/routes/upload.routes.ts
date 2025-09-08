import express from 'express';
import multer from 'multer';
import { uploadContainer } from '../../infrastructure/container/uploadContainer';

const upload = multer();
const router = express.Router();

router.post('/profile', upload.single('file'), uploadContainer.uploadProfile);
router.post('/banner', upload.single('file'), uploadContainer.uploadBanner);
router.post('/art', upload.single('file'), uploadContainer.uploadArt);

export default router;