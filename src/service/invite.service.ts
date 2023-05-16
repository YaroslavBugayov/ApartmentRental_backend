import {Invite, PrismaClient, Profile, Status, User} from "@prisma/client";
import {ApiError} from "../errors/api.error";
import SentInviteDto from "../dtos/sent-invite.dto";
import ReceivedInviteDto from "../dtos/received-invite.dto";
import ReceivedInviteWithContactDto from "../dtos/received-invite-with-contact.dto";
import SentInviteWithContactDto from "../dtos/sent-invete-with-contact.dto";

const prisma = new PrismaClient();

export const inviteService = {
    async send(senderId: number, recipient: string) : Promise<SentInviteDto> {
        const senderProfile: Profile | null = await prisma.profile.findUnique({
            where: {
                userId: senderId
            }
        });

        if (!senderProfile) {
            throw ApiError.BadRequest("First create a profile");
        }

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

        const recipientProfile: Profile | null = await prisma.profile.findUnique({
            where: {
                userId: recipientDb?.id
            }
        });

        if (!recipientProfile) {
            throw ApiError.BadRequest("The recipient does not have a profile");
        }

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

        return new SentInviteDto(recipientDb.username, invite.status);
    },

    async getReceived(id: number) : Promise<ReceivedInviteDto[]> {
        const invites: Invite[] = await prisma.invite.findMany({
            where: {
                recipientId: id
            }
        });
        return await getReceivedInviteDTOs(invites);
    },

    async getReceivedByStatus(id: number, status: string) : Promise<ReceivedInviteDto[]> {
        if (!(status in Status)) {
            throw ApiError.BadRequest("Unknown status");
        }
        const invites: Invite[] = await prisma.invite.findMany({
            where: {
                recipientId: id,
                status: status as Status
            }
        });

        return await getReceivedInviteDTOs(invites);
    },

    async getSent(id: number) : Promise<SentInviteDto[]> {
        const invites: Invite[] = await prisma.invite.findMany({
            where: {
                senderId: id
            }
        });
        return getSentInveteDTOs(invites);
    },

    async getSentByStatus(id: number, status: string) : Promise<SentInviteDto[]> {
        if (!(status in Status)) {
            throw ApiError.BadRequest("Unknown status");
        }
        const invites: Invite[] = await prisma.invite.findMany({
            where: {
                senderId: id,
                status: status as Status
            }
        });
        return getSentInveteDTOs(invites);
    },

    async answer(id: number, sender: string, status: string) : Promise<ReceivedInviteDto> {
        if (!(status in Status)) {
            throw ApiError.BadRequest("Unknown status");
        }
        const senderDb: User | null = await prisma.user.findUnique({
            where: {
                username: sender
            }
        });
        if (!senderDb) {
            throw ApiError.BadRequest("Sender not found");
        }

        const inviteDb: Invite | null = await prisma.invite.findFirst({
            where: {
                senderId: senderDb.id
            }
        });

        if (!inviteDb) {
            throw ApiError.BadRequest("Invite not found");
        }

        const invite: Invite = await prisma.invite.update({
            where: {
                id: inviteDb?.id
            },
            data: {
                status: status as Status
            }
        })

        return new ReceivedInviteDto(sender, invite.status);
    }
}

const getReceivedInviteDTOs = async (invites: Invite[]) : Promise<ReceivedInviteDto[]> => {
    return await Promise.all(invites.map(async invite => {
        const sender: User | null = await prisma.user.findUnique({
            where: {
                id: invite.senderId
            }
        });
        const senderUsername = sender ? sender.username : 'Unknown user';
        if (invite.status == Status.ACCEPTED) {
            const sendersProfile: Profile | null = await prisma.profile.findUnique({
                where: {
                    userId: sender?.id
                }
            });
            return new ReceivedInviteWithContactDto(senderUsername, invite.status,
                sendersProfile?.contact != undefined ? sendersProfile?.contact : 'Contacts not found');
        } else {
            return new ReceivedInviteDto(senderUsername, invite.status);
        }
    }));
}

const getSentInveteDTOs = async (invites: Invite[]) : Promise<SentInviteDto[]> => {
    return await Promise.all(invites.map(async invite => {
        const recipient: User | null = await prisma.user.findUnique({
            where: {
                id: invite.recipientId
            }
        });
        const recipientUsername = recipient ? recipient.username : 'Unknown user';
        if (invite.status == Status.ACCEPTED) {
            const recipientProfile: Profile | null = await prisma.profile.findUnique({
                where: {
                    userId: recipient?.id
                }
            });
            return new SentInviteWithContactDto(recipientUsername, invite.status,
                recipientProfile?.contact != undefined ? recipientProfile?.contact : 'Contacts not found');
        } else {
            return new SentInviteDto(recipientUsername, invite.status);
        }
    }));
}