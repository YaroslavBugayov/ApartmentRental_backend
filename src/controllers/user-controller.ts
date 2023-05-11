import { Request, Response } from 'express';
import { userService } from '../service/user-service';
import { validationResult } from 'express-validator';
import 'dotenv/config';

export const userController = {
    async register(req: Request, res: Response) {
        console.log("test")
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(500).json( { message: 'Invalid data', errors: errors.array() })
            }
            const { email, username, password } = req.body;
            const user = await userService.register(email, username, password);

            res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 360000, httpOnly: true, secure: true });

            return res.status(201).json(user);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Register failed' });
        }
    },

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await userService.login(email, password);

            res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 360000, httpOnly: true, secure: true });

            return res.status(201).json(user);

        } catch (error) {
            // return res.status(401).json({ message: error })
            res.status(500).json({ message: 'Login failed' });
        }
    },

    async logout(req: Request, res: Response) {

    },

    async refresh(req: Request, res: Response) {

    }

};