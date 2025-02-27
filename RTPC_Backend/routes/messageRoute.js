import express from "express";
import {getMessages, getNotification, sendMessage } from "../controllers/messageController.js";
import protectRoute from "../middleware/protectRoute.js";

const messageRouter= express.Router();
messageRouter.post("/notification", getNotification);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.post("/send/:id", protectRoute, sendMessage);


export default messageRouter;