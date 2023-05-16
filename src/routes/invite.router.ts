import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {inviteController} from "../controllers/invite.controller";
import {keywordController} from "../controllers/keyword.controller";

const router = express.Router();

// router.post('/send', inviteController.send)
router.post('/send', authMiddleware, inviteController.send)

export default router;