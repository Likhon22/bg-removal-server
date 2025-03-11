import { Router } from "express";
import upload from "../middlewares/multer.js";
import authUser from "../middlewares/auth.js";
import imageControllers from "../controllers/image.controller.js";

const router = Router();

router.post(
  "/remove-bg",
  upload.single("image"),
  authUser,
  imageControllers.removeBgImage
);

export const imageRoutes = router;
