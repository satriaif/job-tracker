import { Router } from "express";
import { register, login, updateProfile, changePassword } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Protected routes
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, changePassword);

export default router;
