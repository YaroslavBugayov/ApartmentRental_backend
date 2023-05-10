import {UserModel} from "./user-model";

export interface TokenModel {
    user: UserModel,
    refreshToken: string
}