import { Request, Response } from 'express';
import { hashSync } from 'bcrypt'
import { PrismaClient } from '@prisma/client';
import { User } from '../models/User';

const prisma = new PrismaClient();

export const authController = {
    async register(req: Request, res: Response) {
        const { email, username, password } = req.body;
        // const hashedPassword = hashSync(password, 10);

        try {
            const user: User = await prisma.user.create({
                data: {
                    email: email,
                    username: username,
                    password: password
                }
            });

            res.status(201).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Register failed'});
        }
    }

};