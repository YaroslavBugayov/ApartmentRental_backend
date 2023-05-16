import {Gender, Profile} from "@prisma/client";
import KeywordDto from "./keyword.dto";

export default class ProfileDto {
    username;
    age;
    firstName;
    lastName;
    city;
    gender;
    description;
    keywords;

    constructor(profile: Profile, keywords: KeywordDto[], username: string) {
        this.username = username;
        this.age = profile.age;
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.city = profile.city;
        this.gender = profile.gender;
        this.description = profile.description;
        this.keywords = keywords;
    }
}