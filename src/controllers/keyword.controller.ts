import { Request, NextFunction, Response } from "express";
import {keywordService} from "../service/keyword.service";

export const keywordController = {
    async getKeywords(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            return res.status(201).json(await keywordService.getKeywords());
        } catch (error) {
            next(error)
        }
    },
}