import { NextFunction, Request, Response } from "express";
import {profileService} from "../service/profile.service";
import {decode, JwtPayload} from "jsonwebtoken";
import {JwtPayloadModel} from "../models/jwt-payload.model";
import {keywordService} from "../service/keyword.service";
import ProfileDto from "../dtos/profile.dto";

export const profileController = {
    async getAllProfiles(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const profiles: ProfileDto[] = await profileService.getAllProfiles();
            return res.status(201).json(profiles)
        } catch (error) {
            next(error);
        }
    },

    async setProfile(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const { age, gender, city, keywords, description, firstName, lastName } = req.body;
            const { refreshToken } = req.cookies;
            const payload = decode(refreshToken) as JwtPayloadModel;
            console.log(payload)
            const profile = await profileService.setProfile(age, gender, city, keywords, description,
                lastName, firstName, payload.userId);
            return res.status(201).json(profile);
        } catch (error) {
            next(error);
        }
    },

    async getProfile(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const { refreshToken } = req.cookies;
            const payload = decode(refreshToken) as JwtPayloadModel;
            const profile = await profileService.getProfile(payload.userId);
            return res.status(201).json(profile);
        } catch (error) {
            next(error);
        }
    }
}