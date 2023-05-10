enum SourceType{
    TheMovieDB = "TheMovieDB",
    VnDB = "VnDB",
    Bangumi = "Bangumi",
}

enum Category{
    ALL = "全部",
    GAME = "游戏",
    MOVIE = "电影",
    ANIME = "动画",
    NOVEL = "小说",
    MUSIC = "音乐",
}

enum ViewType{
    LIST,
    GRID
}

export {SourceType, Category, ViewType};