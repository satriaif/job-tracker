import { Router } from "express";
import { getApplications, getApplication, createApplication, updateApplication, deleteApplication } from "../controllers/applicationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// All routes protected
router.use(authMiddleware);

router.get("/", getApplications);
router.get("/:id", getApplication);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;
