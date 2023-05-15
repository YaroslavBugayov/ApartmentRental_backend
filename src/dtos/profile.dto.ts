import {Gender, Profile} from "@prisma/client";
import KeywordDto from "./keyword.dto";

export default class ProfileDto {
    age;
    firstName;
    lastName;
    city;
    gender;
    description;
    keywords;

    constructor(profile: Profile, keywords: KeywordDto[]) {
        this.age = profile.age;
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.city = profile.city;
        this.gender = profile.gender;
        this.description = profile.description;
        this.keywords = keywords;
    }
}