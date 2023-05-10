import { sign } from "jsonwebtoken";
import { TokenModel } from "../models/token-model";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const tokenService = {
    generateTokens(userId: number) {

        const accessToken = sign(
            { userId: userId },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: '30m' }
        );

        const refreshToken = sign(
            { userId: userId },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: '30d' }
        );

        return { accessToken, refreshToken };
    },

    async saveToken(userId: number, refreshToken: string) {
        const tokenData = await prisma.token.findUnique({
            where: {
                userId: userId
            }
        });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData;
        }

        const token = await prisma.token.create({
            data: {
                userId: userId,
                refreshToken: refreshToken
            }
        });

        return token;
    }
};