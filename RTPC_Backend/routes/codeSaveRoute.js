import express from "express";
import { saveCode, getCodeByProjectId, submitCode, getLogs, handleLogSelection } from "../controllers/codeContoller.js";

const router = express.Router();

router.post("/save-code", saveCode);
router.post("/submit-code", submitCode);
router.post("/logs-code", getLogs);
router.post("/get-code", getCodeByProjectId);
router.post("/logs-seen", handleLogSelection);


export default router;
