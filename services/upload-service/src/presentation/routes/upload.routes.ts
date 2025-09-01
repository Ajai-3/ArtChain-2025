import express from "express";
import multer from "multer";
import { uploadContainer } from "../../infrastructure/container/uploadContainer";

const upload = multer();
const Router = express.Router()

Router.post("/profile", upload.single("file"), uploadContainer.uploadProfile)
Router.post("/banner", upload.single("file"), uploadContainer.uploadBanner)
Router.post("/art", upload.single("file"), uploadContainer.uploadBanner)

export default Router;