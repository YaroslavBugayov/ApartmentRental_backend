import {compareSync, hashSync} from "bcrypt";
import {UserModel} from "../models/user.model";
import {PrismaClient, Token, User} from '@prisma/client';
import {tokenService} from "./token.service";
import UserDto from '../dtos/user.dto';
import {ApiError} from "../errors/api.error";

const prisma = new PrismaClient();

export const userService = {
    async register(email: string, username: string, password: string)
        : Promise<{refreshToken: string, accessToken: string, userDTO: UserDto}> {
        const candidate = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (candidate) {
            throw ApiError.BadRequest("User already exists");
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

    async login(email: string, password: string)
        : Promise<{refreshToken: string, accessToken: string, userDTO: UserDto}> {
        const user: UserModel | null = await prisma.user.findUnique({
            where:
                { email: email }
        });

        if (!user) {
            throw ApiError.BadRequest('User not found');
        }

        if (!compareSync(password, user.password)) {
            throw ApiError.BadRequest('Incorrect password');
        }

        return await saveToken(user);
    },

    async logout(refreshToken: string) : Promise<Token> {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        return await tokenService.removeToken(refreshToken);
    },

    async refresh(refreshToken: string) : Promise<{refreshToken: string, accessToken: string, userDTO: UserDto}> {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userId = tokenService.validateRefreshToken(refreshToken);
        const token = await tokenService.findToken(refreshToken);

        if (!userId || !token) {
            throw ApiError.UnauthorizedError();
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            throw ApiError.BadRequest("User not found");
        }

        return await saveToken(user);
    }
}

const saveToken = async (user: UserModel) : Promise<{refreshToken: string, accessToken: string, userDTO: UserDto}> => {
    const userDTO = new UserDto(user);
    const tokens = tokenService.generateTokens(user.id);
    const refreshToken = tokens.refreshToken;
    const accessToken = tokens.accessToken;
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { refreshToken, accessToken, userDTO }
}