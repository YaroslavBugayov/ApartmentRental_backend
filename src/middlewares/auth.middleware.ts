import {NextFunction, Response} from "express";
import {ApiError} from "../errors/api.error";
import {tokenService} from "../service/token.service";
import {AuthenticatedRequest} from "../interfaces/authenticated-request.interface";

export default (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authHeader.split(' ')[1];
        const userId = tokenService.validateAccessToken(accessToken);

        if (!userId) {
            return next(ApiError.UnauthorizedError());
        }

        req.userId = userId;
        next();
    } catch (error) {
        return next(ApiError.UnauthorizedError());
    }
}