import {NextFunction, Response} from "express";
import KeywordDto from "../dtos/keyword.dto";
import {keywordService} from "../service/keyword.service";

export const keywordController = {
    async getKeywords(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            return res.status(200).json(keywordService.getKeywords());
        } catch (error) {
            next(error)
        }
    },
}