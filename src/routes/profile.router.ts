import express from "express";
import {profileController} from "../controllers/profile.controller";
import {keywordController} from "../controllers/keyword.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.get('/all', authMiddleware, profileController.getAllProfiles);
router.post('/set', authMiddleware, profileController.setProfile);
router.get('/get', authMiddleware, profileController.getProfile);
router.get('/filter/:keyword', authMiddleware, profileController.getProfilesByKeyword);

router.get('/keywords', authMiddleware, keywordController.getKeywords);

export default router;