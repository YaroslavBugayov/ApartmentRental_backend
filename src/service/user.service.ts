import {compareSync, hashSync} from "bcrypt";
import {UserModel} from "../models/user.model";
import {PrismaClient} from '@prisma/client';
import {tokenService} from "./token.service";
import UserDto from '../dtos/user.dto';

const prisma = new PrismaClient();

export const userService = {
    async register(email: string, username: string, password: string) {
        const candidate = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (candidate) {
            throw new Error("User already exists")
        }

        const hashedPassword = hashSync(password, 10);
        const user: UserModel = await prisma.user.create({
            data: {
                email: email,
                username: username,
                password: hashedPassword
            }
        });

        return await saveToken(user);
    },

    async login(email: string, password: string) {
        const user: UserModel | null = await prisma.user.findUnique({
            where:
                { email: email }
        });

        if (user == null) {
            throw new Error('UserModel not found');
        }

        if (!compareSync(password, user.password)) {
            throw new Error('Incorrect password');
        }

        return await saveToken(user);
    },

    async logout(refreshToken: string) {
        return await tokenService.removeToken(refreshToken);
    },

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new Error("Unauthorized error");
        }
        const userId = tokenService.validateRefreshToken(refreshToken);
        const token = await tokenService.findToken(refreshToken);
        if (!userId || !token) {
            throw new Error("Unauthorized error");
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        return await saveToken(user);
    }
}

const saveToken = async (user: UserModel) => {
    const userDTO = new UserDto(user);
    const tokens = tokenService.generateTokens(user.id);
    const refreshToken = tokens.refreshToken;
    const accessToken = tokens.accessToken;
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { refreshToken, accessToken, userDTO }
}