import KeywordDto from "../dtos/keyword.dto";
import {Keyword, PrismaClient} from "@prisma/client";
import {ProfileModel} from "../models/profile.model";

const prisma = new PrismaClient();

export const keywordService = {
    async getKeywords() : Promise<KeywordDto[]> {
        const keywords: Keyword[] = await prisma.keyword.findMany();
        const keywordDTOs: KeywordDto[] = keywords.map(e => new KeywordDto(e.word));
        return keywordDTOs;
    },

    // async writeKeywords(profile: ProfileModel) {
    //     for (const keyword of profile.keywords) {
    //         const keywordDb: Keyword | null = await prisma.keyword.findUnique({
    //             where: {
    //                 word: keyword.word
    //             }
    //         });
    //
    //         if (!keywordDb) {
    //             prisma.keyword.create({
    //                 data: {
    //                     word: keyword.word,
    //                     profile: {
    //                         connect: profile
    //                     }
    //                 }
    //             })
    //         } else {
    //             prisma.keyword.create()
    //         }
    //     }
    // }
}