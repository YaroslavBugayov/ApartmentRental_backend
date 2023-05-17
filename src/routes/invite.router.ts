import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {inviteController} from "../controllers/invite.controller";

const router = express.Router();

router.post('/send', inviteController.send);
router.get('/get/received', inviteController.getReceived);
router.get('/get/received/filter/:status', inviteController.getReceivedByStatus);
router.get('/get/sent', inviteController.getSent);
router.get('/get/sent/filter/:status', inviteController.getSentByStatus);
router.patch('/answer', inviteController.answer);

export default router;