import {Invite, PrismaClient, Status, User} from "@prisma/client";
import {ApiError} from "../errors/api.error";
import InviteDto from "../dtos/invite.dto";

const prisma = new PrismaClient();

export const inviteService = {
    async send(senderId: number, recipient: string) : Promise<InviteDto> {
        const senderDb: User | null = await prisma.user.findUnique({
            where: {
                id: senderId
            }
        });

        const recipientDb: User | null = await prisma.user.findUnique({
            where: {
                username: recipient
            }
        });

        if (senderDb?.username == recipient) {
            throw ApiError.BadRequest("Sender coincides with recipient")
        }

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

        return new InviteDto(recipientDb.username, invite.status);
    },

    async getReceived(id: number) : Promise<Invite[]> {
        const invites: Invite[] = await prisma.invite.findMany({
            where: {
                recipientId: id
            }
        });
        return invites;
    }
}