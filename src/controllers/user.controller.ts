import {NextFunction, Request, Response} from 'express';
import { userService } from '../service/user.service';
import { validationResult } from 'express-validator';
import 'dotenv/config';

export const userController = {
    async register(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(500).json( { message: 'Invalid data', errors: errors.array() })
            }
            const { email, username, password } = req.body;
            const user = await userService.register(email, username, password);

            const links = [ loginLink, logoutLink, refreshLink ];

            res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 360000, httpOnly: true });

            return res.status(201).json({ user, "links": links });
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const { email, password } = req.body;
            const user = await userService.login(email, password);

            const links = [ registerLink, logoutLink, refreshLink ];

            res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 360000, httpOnly: true });

            return res.status(201).json({ user, "links": links });
        } catch (error) {
            next(error)
        }
    },

    async logout(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);

            const links = [ loginLink, registerLink ]

            res.clearCookie('refreshToken');
            return res.status(200).json({ token, "links": links });
        } catch (error) {
            next(error)
        }
    },

    async refresh(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const { refreshToken } = req.cookies;
            const user = await userService.refresh(refreshToken);

            const links = [ loginLink, registerLink, logoutLink ];

            res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 360000, httpOnly: true });

            return res.status(201).json({ user, "links": links });
        } catch (error) {
            next(error)
        }
    }
};

const loginLink = {
    "rel": "login",
    "href": "/api/login",
    "method": "POST"
};

const registerLink = {
    "rel": "register",
    "href": "/api/register",
    "method": "POST"
};

const logoutLink = {
    "rel": "logout",
    "href": "/api/logout",
    "method": "POST"
};

const refreshLink = {
    "rel": "refresh",
    "href": "/api/refresh",
    "method": "GET"
}