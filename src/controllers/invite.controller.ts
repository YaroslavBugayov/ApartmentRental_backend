import {NextFunction, Response} from "express";
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

    async getReceived(req: AuthenticatedRequest, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            return res.status(200).json(await inviteService.getReceived(req.userId as number));
        } catch (error) {
            next(error);
        }
    },

    async getSent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            return res.status(200).json(await inviteService.getSent(req.userId as number));
        } catch (error) {
            next(error);
        }
    },

    async getReceivedByStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const { status } = req.params;
            return res.status(200).json(await inviteService.getReceivedByStatus(req.userId as number, status));
        } catch (error) {
            next(error);
        }
    },

    async getSentByStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { status } = req.params;
            return res.status(200).json(await inviteService.getSentByStatus(req.userId as number, status));
        } catch (error) {
            next(error);
        }
    },

    async answer(req: AuthenticatedRequest, res: Response, next: NextFunction) : Promise<Response | undefined> {
        try {
            const { sender, status } = req.body;
            const invite = await inviteService.answer(req.userId as number, sender, status);
            return res.status(201).json(invite);
        } catch (error) {
            next(error);
        }
    }
}