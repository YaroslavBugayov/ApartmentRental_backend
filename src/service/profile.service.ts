import {Gender, PrismaClient, Profile} from "@prisma/client";
import {KeywordModel} from "../models/keyword.model";
import {ApiError} from "../errors/api.error";
import KeywordDto from "../dtos/keyword.dto";
import ProfileDto from "../dtos/profile.dto";
import {keywordService} from "./keyword.service";

const prisma = new PrismaClient();

export const profileService = {
    async getAllProfiles() : Promise<ProfileDto[]> {
        const profiles = await prisma.profile.findMany();
        const profileDTOs = await Promise.all(profiles.map(async profile => {
            const keywords: KeywordDto[] = await keywordService.getProfilesKeywords(profile.userId);
            return new ProfileDto(profile, keywords);
        }));
        return profileDTOs;
    },

    async setProfile(age: number, gender: string, city: string, keywords: KeywordModel[], description: string,
                     lastName: string, firstName: string, id: number) : Promise<ProfileDto> {

        const profileDb: Profile | null = await prisma.profile.findUnique({
            where: {
                userId: id
            }
        });

        if (!(gender in Gender)) {
            throw ApiError.BadRequest("Unknown gender");
        }

        if (profileDb != null) {
            await prisma.profileKeyword.deleteMany({
                where: {
                    profileId: profileDb.id
                }
            })
        }

        const data = {
            age: age,
            firstName: firstName,
            lastName: lastName,
            city: city,
            gender: gender as Gender,
            description: description,
            user: {
                connect:
                    { id: id }
            },
            keywords: {
                create: keywords
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

        const keywordDTOs: KeywordDto[] = await keywordService.getProfilesKeywords(id);
        return new ProfileDto(profileData, keywordDTOs);
    },

    async getProfile(id: number) : Promise<ProfileDto | null> {
        const profile: Profile | null = await prisma.profile.findUnique({
            where: {
                userId: id
            }
        });
        if (!profile) {
            throw ApiError.BadRequest("Profile not found");
        }

        const keywords: KeywordDto[] = await keywordService.getProfilesKeywords(id);
        return new ProfileDto(profile, keywords);
    },

    async getProfilesByKeyword(keyword: string) : Promise<ProfileDto[]> {
        const profiles = await prisma.profile.findMany({
            where: {
                keywords: {
                    some: {
                        keyword: {
                            word: keyword
                        }
                    }
                }
            }
        });
        const profileDTOs = await Promise.all(profiles.map(async profile => {
            const keywords: KeywordDto[] = await keywordService.getProfilesKeywords(profile.userId);
            return new ProfileDto(profile, keywords);
        }));
        return profileDTOs;
    },

    async getProfilesByCity(city: string) : Promise<ProfileDto[]> {
        const profiles = await prisma.profile.findMany({
            where: {
                city: city
            }
        });
        const profileDTOs = await Promise.all(profiles.map(async profile => {
            const keywords: KeywordDto[] = await keywordService.getProfilesKeywords(profile.userId);
            return new ProfileDto(profile, keywords);
        }));
        return profileDTOs;
    },

    async getProfilesByGender(gender: string) : Promise<ProfileDto[]> {
        if (!(gender in Gender)) {
            throw ApiError.BadRequest("Unknown gender");
        }
        const profiles = await prisma.profile.findMany({
            where: {
                gender: gender as Gender
            }
        });
        const profileDTOs = await Promise.all(profiles.map(async profile => {
            const keywords: KeywordDto[] = await keywordService.getProfilesKeywords(profile.userId);
            return new ProfileDto(profile, keywords);
        }));
        return profileDTOs;
    },
}