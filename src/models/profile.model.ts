import {Gender, Keyword, User} from "@prisma/client";

export interface ProfileModel {
    id: number;
    age: number;
    firstName: string;
    lastName: string;
    city: string;
    gender: Gender;
    description: string;
    user: User;
    keywords: Keyword[];
}