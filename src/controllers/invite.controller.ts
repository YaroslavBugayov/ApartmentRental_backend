import {NextFunction, Request, Response} from "express";
import {inviteService} from "../service/invite.service";
import {AuthenticatedRequest} from "../interfaces/authenticated-request.interface";

export const inviteController = {
    async send(req: AuthenticatedRequest, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const { recipient } = req.body;
            return res.status(201).json(await inviteService.send(req.userId as number, recipient));
        } catch (error) {
            next(error);
        }
    },

    async getReceived(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            return res.status(201).json(await inviteService.getReceived(req.userId as number));
        } catch (error) {
            next(error);
        }
    }
}