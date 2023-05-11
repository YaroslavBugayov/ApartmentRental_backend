import {UserModel} from "../models/user.model";

export default class UserDto {
    id;
    email;

    constructor(model: UserModel) {
        this.id = model.id;
        this.email = model.email;
    }
}

