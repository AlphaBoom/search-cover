import { Category, SourceType } from "../src/types/enums";
import type { Movie, TV } from "../src/types/response"
import type { TheMovieDbResponse, BangumiResponse } from "../src/types/response"
import type { SearchResult } from "../src/types/model";

export const config = {
  runtime: 'edge',
};

type SearchFunction = (keyword: string, startCursor: number | string, pageSize: number) => Promise<SearchResult[]>

function getCategoryInTheMovieDB(obj: Movie | TV): Category {
  let ids = obj.genre_ids
  if (ids.includes(16)) {
    return Category.ANIME
  }
  if (obj.media_type == "movie") {
    return Category.MOVIE
  } else {
    return Category.ALL
  }
}

async function fetchFromTheMovieDB(keyword: string, startCursor: number | string, pageSize: number): Promise<SearchResult[]> {
  const apiKey = process.env.THEMOVIEDB_API_KEY ?? ''
  const url = new URL("https://api.themoviedb.org/3/search/multi")
  const params = url.searchParams
  params.set("api_key", apiKey)
  params.set('language', 'zh_CN')
  params.set('query', keyword)
  params.set('include_adult', 'true')
  if (typeof startCursor === "string") {
    startCursor = parseInt(startCursor, 10)
  }
  pageSize = Math.max(1, pageSize)
  params.set('page', (Math.ceil(startCursor / pageSize) + 1).toString())
  let response: TheMovieDbResponse = await (await fetch(url)).json()
  return response.results.filter((obj) => obj.media_type != 'person')
    .map((obj) => ({
      source: SourceType.TheMovieDB,
      category: getCategoryInTheMovieDB(<Movie | TV>obj),
      title: (<Movie>obj).title ?? (<TV>obj).name,
      thumbnail: `https://image.tmdb.org/t/p/w500${(<Movie | TV>obj).poster_path ?? ""}`,
      imageUrl: `https://image.tmdb.org/t/p/w500${(<Movie | TV>obj).poster_path ?? ""}`,
      description: (<Movie | TV>obj).overview,
    }))
}

function bangumiSubjectTypeToCategory(subjectType: number): Category {
  switch (subjectType) {
    case 1:
      return Category.NOVEL
    case 2:
      return Category.ANIME
    case 3:
      return Category.MUSIC
    case 4:
      return Category.GAME
    default:
      return Category.MOVIE
  }
}

async function fetchFromBangumi(keyword: string, startCursor: number | string, pageSize: number): Promise<SearchResult[]> {
  const url = new URL(`https://api.bgm.tv/search/subject/${encodeURIComponent(keyword)}`)
  const params = url.searchParams
  // params.set('type', '2')
  params.set('responseGroup', 'medium')
  params.set('start', `${startCursor}`)
  params.set('max_results', Math.min(pageSize,25).toString())
  let response: BangumiResponse = await (await fetch(url)).json()
  return response.list.map((obj) => ({
    source: SourceType.Bangumi,
    category: bangumiSubjectTypeToCategory(obj.type),
    title: obj.name,
    description: obj.summary,
    thumbnail: obj.images?.small ?? "",
    imageUrl: obj.images?.large ?? "",
  }))
}

var builtInSources: { [key: string]: SearchFunction } = {
  [SourceType.Bangumi]: fetchFromBangumi,
  [SourceType.TheMovieDB]: fetchFromTheMovieDB,
}

export default async (request: Request) => {
  const url = new URL(request.url)
  let source = url.searchParams.get('source') ?? SourceType.Bangumi
  let keyword = url.searchParams.get('query')
  let startCursor = url.searchParams.get('start_cursor') ?? '0'
  let pageSize = url.searchParams.get('page_size') ?? '20'
  if (!(source in builtInSources)) {
    return new Response("Unknown source type", {
      status: 400,
    })
  }
  let results = await builtInSources[source](keyword ?? "", parseInt(startCursor, 10), parseInt(pageSize, 10))
  return new Response(JSON.stringify(results))
};