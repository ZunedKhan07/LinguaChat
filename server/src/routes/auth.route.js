import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/logout", logoutUser);

export default router;