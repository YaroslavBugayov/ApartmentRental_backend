import {Status} from "@prisma/client";

export default class ReceivedInviteWithContactDto {
    senderUsername: string;
    status: Status;
    contact: string;

    constructor(senderUsername: string, status: Status, contact: string) {
        this.senderUsername = senderUsername;
        this.status = status;
        this.contact = contact;
    }
}