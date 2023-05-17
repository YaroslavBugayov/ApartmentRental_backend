import {Gender, PrismaClient, Profile, User} from "@prisma/client";
import {KeywordModel} from "../models/keyword.model";
import {ApiError} from "../errors/api.error";
import KeywordDto from "../dtos/keyword.dto";
import ProfileDto from "../dtos/profile.dto";
import {keywordService} from "./keyword.service";

type ProfileWithUser = Profile & { user: User }

const prisma = new PrismaClient();

export const profileService = {
    async getAllProfiles() : Promise<ProfileDto[]> {
        const profiles: ProfileWithUser[] = await prisma.profile.findMany({
            include: {
                user: true
            }
        });
        const profileDTOs = await Promise.all(profiles.map(async profile => {
            const keywords: KeywordDto[] = await keywordService.getProfilesKeywords(profile.userId);
            return new ProfileDto(profile, keywords, profile.user.username);
        }));
        return profileDTOs;
    },

    async setProfile(age: number, gender: string, city: string, keywords: KeywordModel[], description: string,
                     lastName: string, firstName: string, contact: string, id: number)
        : Promise<{ profile: ProfileDto, contact: string } | null> {

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
            contact: contact,
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

        const profileData: ProfileWithUser = !profileDb
            ? await prisma.profile.create({
                data: data,
                include: {
                    user: true
                }
            })
            : await prisma.profile.update({
                where: {
                    userId: id
                },
                data: data,
                include: {
                    user: true
                }
            });

        const keywordDTOs: KeywordDto[] = await keywordService.getProfilesKeywords(id);
        return { profile: new ProfileDto(profileData, keywordDTOs, profileData.user.username),
            contact: profileData.contact };
    },

    async getProfile(id: number) : Promise<{ profile: ProfileDto, contact: string } | null> {
        const profile: ProfileWithUser | null = await prisma.profile.findUnique({
            where: {
                userId: id
            },
            include: {
                user: true
            }
        });
        if (!profile) {
            throw ApiError.BadRequest("Profile not found");
        }

        const keywords: KeywordDto[] = await keywordService.getProfilesKeywords(id);
        return { profile: new ProfileDto(profile, keywords, profile.user.username), contact: profile.contact };
    },

    async getProfilesByKeyword(keyword: string) : Promise<ProfileDto[]> {
        const profiles: ProfileWithUser[] = await prisma.profile.findMany({
            where: {
                keywords: {
                    some: {
                        keyword: {
                            word: keyword
                        }
                    }
                }
            },
            include: {
                user: true
            }
        });

        return await getProfileDTOs(profiles);
    },

    async getProfilesByCity(city: string) : Promise<ProfileDto[]> {
        const profiles = await prisma.profile.findMany({
            where: {
                city: city
            },
            include: {
                user: true
            }
        });

        return await getProfileDTOs(profiles);
    },

    async getProfilesByGender(gender: string) : Promise<ProfileDto[]> {
        if (!(gender in Gender)) {
            throw ApiError.BadRequest("Unknown gender");
        }
        const profiles: ProfileWithUser[] = await prisma.profile.findMany({
            where: {
                gender: gender as Gender
            },
            include: {
                user: true
            }
        });

        return await getProfileDTOs(profiles);
    },

    async getProfilesByFilter(gender: string, city: string, keywords: string[]) : Promise<ProfileDto[]> {
        if (gender && !(gender in Gender)) {
            throw ApiError.BadRequest("Unknown gender");
        }
        const profiles: ProfileWithUser[] = await prisma.profile.findMany({
            where: {
                gender: gender as Gender,
                city: city,
                keywords: {
                    some: {
                        keyword: {
                            word: {
                                in: keywords
                            }
                        }
                    }
                }
            },
            include: {
                user: true
            }
        });

        if (!keywords) {
            return await getProfileDTOs(profiles);
        } else {
            return (await getProfileDTOs(profiles)).filter(profile => {
                return keywords.every(item => profile.keywords.map(keywords => keywords.word).includes(item));
            });
        }
    },

    async delete(id: number) : Promise<Profile> {
        const profileDb: Profile | null = await prisma.profile.findUnique({
            where: {
                userId: id
            }
        });
        if (!profileDb) {
            throw ApiError.BadRequest("Profile not found");
        }
        await prisma.profileKeyword.deleteMany({
            where: {
                profileId: profileDb.id
            }
        });

        const profile: Profile = await prisma.profile.delete({
            where: {
                userId: id
            }
        });
        return profile;
    }
}

const getProfileDTOs = async (profiles: ProfileWithUser[]) : Promise<ProfileDto[]> => {
    return await Promise.all(profiles.map(async profile => {
        const keywords: KeywordDto[] = await keywordService.getProfilesKeywords(profile.userId);
        return new ProfileDto(profile, keywords, profile.user.username);
    }));
}