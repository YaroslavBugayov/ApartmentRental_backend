import { NextFunction, Request, Response } from "express";
import {profileService} from "../service/profile.service";
import {decode, JwtPayload} from "jsonwebtoken";
import {JwtPayloadModel} from "../models/jwt-payload.model";

export const profileController = {
    async getProfiles(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const profiles = await profileService.getAllUsers();
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
            const profile = await profileService.setProfile(age, gender, city, keywords, description,
                lastName, firstName, payload.userId);
            return res.status(201).json(profile);
        } catch (error) {
            next(error);
        }
    }
}