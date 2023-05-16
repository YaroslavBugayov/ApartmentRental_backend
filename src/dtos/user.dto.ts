import {UserModel} from "../models/user.model";

export default class UserDto {
    username;
    email;

    constructor(model: UserModel) {
        this.username = model.username;
        this.email = model.email;
    }
}

