import {Genger, Keyword, User} from "@prisma/client";

export interface ProfileModel {
    id: number;
    age: number;
    firstName: string;
    lastName: string;
    city: string;
    gender: Genger;
    description: string;
    user: User;
    keywords: Keyword[];
}