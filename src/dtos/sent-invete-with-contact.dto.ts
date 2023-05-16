import {Status} from "@prisma/client";

export default class SentInviteWithContactDto {
    recipientUsername: string;
    status: Status;
    contact: string;

    constructor(recipientUsername: string, status: Status, contact: string) {
        this.recipientUsername = recipientUsername;
        this.status = status;
        this.contact = contact;
    }
}