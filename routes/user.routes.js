import { Router } from "express";
import userControllers from "../controllers/user.controller.js";

const router = Router();

router.post("/webhooks", userControllers.clerkWebhooks);

export const userRoutes = router;
