import { Router } from "express";
import userControllers from "../controllers/user.controller.js";
import authUser from "../middlewares/auth.js";

const router = Router();

router.post("/webhooks", userControllers.clerkWebhooks);

router.get("/credits", authUser, userControllers.getUserCredits);
export const userRoutes = router;
