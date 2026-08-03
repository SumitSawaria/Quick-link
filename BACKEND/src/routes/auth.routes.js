import express from "express";
import {
	change_password,
	forgot_password,
	login_user,
	logout_user,
	me,
	refresh,
	register_user,
	reset_password,
	update_profile,
	verify_email,
} from "../controller/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register_user);
router.post("/login", login_user);
router.post("/logout", requireAuth, logout_user);
router.post("/refresh", refresh);

router.get("/me", requireAuth, me);
router.get("/verify-email", verify_email);

router.post("/forgot-password", forgot_password);
router.post("/reset-password", reset_password);
router.post("/change-password", requireAuth, change_password);
router.put("/profile", requireAuth, update_profile);

export default router;
