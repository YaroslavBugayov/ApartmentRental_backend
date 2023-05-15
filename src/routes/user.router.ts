import express from 'express';
import { userController } from '../controllers/user.controller';
import {profileController} from "../controllers/profile.controller";
import {keywordController} from "../controllers/keyword.controller";
// import { body } from 'express-validator'

const router = express.Router();

router.post('/register',
    // body('email').isEmail,
    // body('username').isLength({ min: 3, max: 20 }),
    // body('password').isLength({ min: 5, max: 50 }),
    userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/profile/all', profileController.getProfiles)

router.post('/profile/set', profileController.setProfile)
router.get('/profile/get', profileController.getProfile)

router.get('/keywords', keywordController.getKeywords)

export default router;