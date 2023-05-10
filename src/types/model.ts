import type { Category, SourceType } from "./enums";

export interface SearchResult{
    key?: string,
    source:SourceType,
    category:Category,
    thumbnail:string,
    imageUrl:string,
    title:string,
    description:string,
}