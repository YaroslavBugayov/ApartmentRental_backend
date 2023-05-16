import {Invite, PrismaClient, Status, User} from "@prisma/client";
import {ApiError} from "../errors/api.error";

const prisma = new PrismaClient();

export const inviteService = {
    async send(sender: string, recipient: string) : Promise<Invite> {
        const senderDb: User | null = await prisma.user.findUnique({
            where: {
                username: sender
            }
        });

        const recipientDb: User | null = await prisma.user.findUnique({
            where: {
                username: recipient
            }
        });

        if (!senderDb) {
            throw ApiError.BadRequest("Sender not found");
        }
        if (!recipientDb) {
            throw ApiError.BadRequest("Recipient not found");
        }

        const existingInvite = await prisma.invite.findFirst({
            where: {
                senderId: senderDb.id,
                recipientId: recipientDb.id
            }
        });
        if (existingInvite != null) {
            throw ApiError.BadRequest("Invite already exists");
        }

        const invite = await prisma.invite.create({
            data: {
                senderId: senderDb.id,
                recipientId: recipientDb.id,
                status: Status.SENT
            }
        });

        return invite;
    }
}