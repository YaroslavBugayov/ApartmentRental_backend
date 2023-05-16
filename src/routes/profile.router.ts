import express from "express";
import {profileController} from "../controllers/profile.controller";
import {keywordController} from "../controllers/keyword.controller";

const router = express.Router();

router.get('/all', profileController.getAllProfiles);
router.post('/set', profileController.setProfile);
router.get('/get', profileController.getProfile);

router.get('/keywords', keywordController.getKeywords);

export default router;