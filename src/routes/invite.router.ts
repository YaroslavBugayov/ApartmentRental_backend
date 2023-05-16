import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {inviteController} from "../controllers/invite.controller";

const router = express.Router();

router.post('/send', authMiddleware, inviteController.send);
router.get('/get', authMiddleware, inviteController.getReceived);
router.patch('/answer', authMiddleware, inviteController.answer);

export default router;