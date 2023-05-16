import {Status} from "@prisma/client";

export default class ReceivedInviteDto {
    senderUsername: string;
    status: Status;

    constructor(senderUsername: string, status: Status) {
        this.senderUsername = senderUsername;
        this.status = status;
    }
}