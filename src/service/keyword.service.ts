import KeywordDto from "../dtos/keyword.dto";
import {Keyword, PrismaClient, Profile, ProfileKeyword} from "@prisma/client";
import {ProfileModel} from "../models/profile.model";
import {ApiError} from "../errors/api.error";

const prisma = new PrismaClient();

export const keywordService = {
    async getKeywords() : Promise<KeywordDto[]> {
        const keywords: Keyword[] = await prisma.keyword.findMany();
        const keywordDTOs: KeywordDto[] = keywords.map(e => new KeywordDto(e.word));
        return keywordDTOs;
    },

    async getProfilesKeywords(id: number) : Promise<KeywordDto[]> {
        const profile: Profile | null = await prisma.profile.findUnique({ where: { userId: id } });
        if (!profile) {
            throw ApiError.BadRequest("User not found");
        } else {
            const profileKeywords: ProfileKeyword[] = await prisma.profileKeyword.findMany({
                where: {
                    profileId: profile.id
                }
            });
            const keywordIds = profileKeywords.map((elem) => elem.keywordId);

            const keywords = await prisma.keyword.findMany({
                where: { id: { in: keywordIds } },
            });

            const keywordDTOs: KeywordDto[] = keywords
                .filter((keyword) => keyword !== null)
                .map((keyword) => new KeywordDto(keyword!.word));

            return keywordDTOs;
        }
    }
}