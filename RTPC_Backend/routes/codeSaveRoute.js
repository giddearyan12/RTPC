import express from "express";
import { saveCode, getCodeByProjectId } from "../controllers/codeContoller.js";

const router = express.Router();

router.post("/save-code", saveCode);

router.post("/get-code", getCodeByProjectId);

export default router;
