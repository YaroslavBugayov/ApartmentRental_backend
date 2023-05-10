import { Request, Response } from 'express';
import { hashSync, compareSync } from 'bcrypt'
import { PrismaClient } from '@prisma/client';
import { UserModel } from '../models/user-model';
import { sign, decode } from 'jsonwebtoken';
import 'dotenv/config'
import {userService} from "../service/user-service";

const prisma = new PrismaClient();

export const userController = {
    async register(req: Request, res: Response) {
        try {
            const { email, username, password } = req.body;
            const user = await userService.register(email, username, password)
            res.cookie('refreshToken', user.refreshToken, { maxAge: 30 * 24 * 360000, httpOnly: true, secure: true })
            return res.status(201).json(user);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Register failed' });
        }
    },

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const user: UserModel | null = await prisma.user.findUnique({
                where:
                    { email: email }
            });

            if (user == null) {
                return res.status(401).json({ message: 'UserModel not found' })
            }

            if (!compareSync(password, user.password)) {
                return res.status(401).json({ message: 'incorrect password' })
            }

            const token = sign(
                { userId: user.id },
                process.env.JWT_ACCESS_SECRET as string,
                { expiresIn: '8760h' }
            )

            res.json({ token })

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Login failed' })
        }
    },

    async logout(req: Request, res: Response) {

    },

    async refresh(req: Request, res: Response) {

    }

};