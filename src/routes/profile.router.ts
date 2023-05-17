import express from "express";
import {profileController} from "../controllers/profile.controller";
import {keywordController} from "../controllers/keyword.controller";

const router = express.Router();

router.get('/all', profileController.getAllProfiles);
router.post('/set', profileController.setProfile);
router.get('/get', profileController.getProfile);
router.delete('/delete', profileController.delete);
router.get('/filter', profileController.getProfilesByFilter);
router.get('/filter/keyword/:keyword', profileController.getProfilesByKeyword);
router.get('/filter/city/:city', profileController.getProfilesByCity);
router.get('/filter/gender/:gender', profileController.getProfilesByGender);

router.get('/keywords', keywordController.getKeywords);

export default router;