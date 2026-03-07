import Router from "express";
import { translateMessage } from "../services/translate.servise.js";

const router = Router();

router.post("/translate-message", translateMessage);

export default router