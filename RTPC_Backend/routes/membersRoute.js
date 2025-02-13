import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar, markRead } from "../controllers/memberController.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.post("/mark", markRead);

export default router;