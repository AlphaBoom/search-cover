export type Movie = {
    poster_path?:string,
    adult:boolean,
    overview:string,
    release_date:string,
    original_title:string,
    genre_ids:number[],
    id:number,
    media_type:"movie",
    original_language:string,
    title:string,
    backdrop_path?:string,
    popularity:number,
    vote_count:number,
    video:boolean,
    vote_average:number,
}

export type TV = {
    poster_path?:string,
    popularity:string,
    id:number,
    overview:string,
    backdrop_path?:string,
    vote_average:number,
    media_type:'tv',
    first_air_date:string,
    origin_country:number[],
    genre_ids:number[],
    vote_count:number,
    name:string,
    original_name:string,
}

type Person = {
    media_type:'person'
}

export interface TheMovieDbResponse{
    page:number,
    results:(Movie|TV|Person)[],
    total_results:number,
    total_pages:number,
}

interface VnDbResponse{

}

export interface BangumiResponse{
    results:number,
    list:{
        id:number,
        url:string,
        type:1|2|3|4|6, // 1 书籍 2 动画 3 音乐 4 游戏 6 三次元
        name:string,
        name_cn:string,
        summary:string,
        air_date:string,
        air_weekday:number,
        images?:{
            large:string,
            common:string,
            medium:string,
            small:string,
            grid:string,
        },
        eps:{
            id:number,
            url:string,
            type:0|1|2|3|4|5|6,
            sort:number,
            name:string,
            name_cn:string,
            duration:string,
            airdate:string,
            comment:number,
            desc:string,
            status:string,
        },
        eps_count:number,
        rating:{
            total:number,
            count:{
                1:number,
                2:number,
                3:number,
                4:number,
                5:number,
                6:number,
                7:number,
                8:number,
                9:number,
                10:number,
            },
            score:number,
        },
        rank:number,
        collection:{
            wish:number,
            collect:number,
            doing:number,
            on_hold:number,
            dropped:number,
        },
    }[],
}