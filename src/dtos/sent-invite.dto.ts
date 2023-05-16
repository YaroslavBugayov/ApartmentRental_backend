import {Status} from "@prisma/client";

export default class SentInviteDto {
    recipientUsername: string;
    status: Status;

    constructor(recipientUsername: string, status: Status) {
        this.recipientUsername = recipientUsername;
        this.status = status;
    }
}