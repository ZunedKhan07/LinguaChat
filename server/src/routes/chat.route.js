import Router from "express";
import { getSmartTranslation } from "../controllers/chat.controller.js";

const router = Router();

router.post("/translate-message", getSmartTranslation);

export default router