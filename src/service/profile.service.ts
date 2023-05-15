import {Genger, PrismaClient, Profile} from "@prisma/client";
import {KeywordModel} from "../models/keyword.model";

const prisma = new PrismaClient();

export const profileService = {
    async getAllUsers() : Promise<Profile[]> {
        const profiles = await prisma.profile.findMany();
        return profiles;
    },

    async setProfile(age: number, gender: string, city: string, keywords: KeywordModel[], description: string,
                     lastName: string, firstName: string, id: number) : Promise<Profile> {

        const profileDb: Profile | null = await prisma.profile.findUnique({
            where: {
                userId: id
            }
        });

        const existingKeywords = await prisma.keyword.findMany({
            where: {
                word: {
                    in: keywords.map(keyword => keyword.word)
                }
            }
        });

        const existingKeywordWords = new Set(existingKeywords.map(keyword => keyword.word));

        const data = {
            age: age,
            firstName: firstName,
            lastName: lastName,
            city: city,
            gender: gender as Genger,
            description: description,
            user: {
                connect:
                    { id: id }
            },
            keywords: {
                create: keywords
                    .filter(keyword => !existingKeywordWords.has(keyword.word))
                    .map(keyword => ({
                        keyword: {
                            connectOrCreate: {
                                where: {
                                    word: keyword.word
                                },
                                create: {
                                    word: keyword.word
                                }
                            }
                        }
                    }))
            }
        };

        const profileData: Profile = !profileDb
            ? await prisma.profile.create({
                data: data
            })
            : await prisma.profile.update({
                where: {
                    userId: id
                },
                data: data
            });

        return profileData;
    },

    async getProfile(id: number) : Promise<Profile | null> {
        const profile: Profile | null = await prisma.profile.findUnique({
            where: {
                userId: id
            }
        });
        return profile;
    }
}