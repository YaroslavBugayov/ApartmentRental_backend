import { Request, Response } from 'express';
import { hashSync, compareSync } from 'bcrypt'
import { PrismaClient } from '@prisma/client';
import { User } from '../models/User';
import { sign } from 'jsonwebtoken';
import 'dotenv/config'

const prisma = new PrismaClient();

export const authController = {
    async register(req: Request, res: Response) {
        const { email, username, password } = req.body;
        const hashedPassword = hashSync(password, 10);

        try {
            const user: User = await prisma.user.create({
                data: {
                    email: email,
                    username: username,
                    password: hashedPassword
                }
            });

            res.status(201).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Register failed' });
        }
    },

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const user: User | null = await prisma.user.findUnique({
                where:
                    { email: email }
            });

            if (user == null) {
                return res.status(401).json({ message: 'User not found' })
            }

            if (!compareSync(password, user.password)) {
                return res.status(401).json({ message: 'incorrect password' })
            }

            const token = sign(
                { userId: user.id },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            )

            res.json({ token })

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Login failed' })
        }
    }

};