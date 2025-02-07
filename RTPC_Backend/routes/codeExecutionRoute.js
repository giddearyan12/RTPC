import express from "express";
import { executeCode } from "../controllers/codeExecutionController.js";

const router = express.Router();

// Route to execute code
router.post("/execute", executeCode);

export default router;
