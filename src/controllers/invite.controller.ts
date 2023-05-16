import {NextFunction, Request, Response} from "express";
import {inviteService} from "../service/invite.service";

export const inviteController = {
    async send(req: Request, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const { sender, recipient } = req.body;
            return res.status(201).json(await inviteService.send(sender, recipient));
        } catch (error) {
            next(error);
        }
    }
}