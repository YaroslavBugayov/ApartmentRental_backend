import {Keyword} from "@prisma/client";

export default class KeywordDto {
    word;
    constructor(keyword: string) {
        this.word = keyword
    }
}