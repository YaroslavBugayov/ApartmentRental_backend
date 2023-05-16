import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {inviteController} from "../controllers/invite.controller";

const router = express.Router();

router.post('/send', authMiddleware, inviteController.send);
router.get('/get/received', authMiddleware, inviteController.getReceived);
router.get('/get/received/filter/:status', authMiddleware, inviteController.getReceivedByStatus);
router.get('/get/sent', authMiddleware, inviteController.getSent);
router.get('/get/sent/filter/:status', authMiddleware, inviteController.getSentByStatus);
router.patch('/answer', authMiddleware, inviteController.answer);

export default router;