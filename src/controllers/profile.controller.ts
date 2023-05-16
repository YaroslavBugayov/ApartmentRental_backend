import { NextFunction, Request, Response } from "express";
import {profileService} from "../service/profile.service";
import ProfileDto from "../dtos/profile.dto";
import {AuthenticatedRequest} from "../interfaces/authenticated-request.interface";

export const profileController = {
    async getAllProfiles(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const profiles: ProfileDto[] = await profileService.getAllProfiles();
            return res.status(201).json(profiles)
        } catch (error) {
            next(error);
        }
    },

    async setProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const { age, gender, city, keywords, description, firstName, lastName } = req.body;
            const profile = await profileService.setProfile(age, gender, city, keywords, description,
                lastName, firstName, req.userId as number);
            return res.status(201).json(profile);
        } catch (error) {
            next(error);
        }
    },

    async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const profile = await profileService.getProfile(req.userId as number);
            return res.status(201).json(profile);
        } catch (error) {
            next(error);
        }
    },

    async getProfilesByKeyword(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const { keyword } = req.params;
            const profiles: ProfileDto[] = await profileService.getProfilesByKeyword(keyword);
            return res.status(201).json(profiles)
        } catch (error) {
            next(error);
        }
    },

    async getProfilesByCity(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const { city } = req.params;
            const profiles: ProfileDto[] = await profileService.getProfilesByCity(city);
            return res.status(201).json(profiles)
        } catch (error) {
            next(error);
        }
    },

    async getProfilesByGender(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const { gender } = req.params;
            const profiles: ProfileDto[] = await profileService.getProfilesByGender(gender);
            return res.status(201).json(profiles)
        } catch (error) {
            next(error);
        }
    },
}