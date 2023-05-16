import {NextFunction, Request, Response} from "express";

export const inviteController = {
    async send(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            return res.status(201);
        } catch (error) {
            next();
        }
    }
}