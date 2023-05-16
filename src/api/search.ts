import type { SearchResult } from "../types/model";
import GlobalConfig from "../config";

type SourceInfo = {
    source: string,
    start: number,
    done: boolean,
}

class SearchSession {
    private cache: SearchResult[] = []
    private sources: SourceInfo[]

    private constructor(readonly query: string, readonly pageSize: number) {
        this.sources = Object.entries(GlobalConfig.sourceConfig)
            .filter(([_, value]) => value > 0)
            .sort((left, right) => left[1] - right[1])
            .map(([key, _]) => ({ source: key, start: 0, done: false }))
    }

    static async search(query: string, pageSize: number = 20): Promise<SearchSession> {
        let session = new SearchSession(query, pageSize)
        await session.fetchAndCache(1)
        return session
    }

    private async searchBySource(source: string, query: string, startCursor: string | number): Promise<SearchResult[]> {
        const url = new URL("/api/search", window.location.origin)
        const params = url.searchParams
        params.set('query', query)
        params.set('start_cursor', `${startCursor}`)
        params.set('page_size', this.pageSize.toString())
        params.set('source', source)
        try {
            return await (await fetch(url)).json()
        } catch (error) {
            return []
        }
    }

    private udpateCache(newarr: SearchResult[]) {
        this.cache = [...this.cache, ...newarr];
        this.cache.forEach((item, index) => { item.key = (index + 1).toString() })
    }

    private async fetchAndCache(page: number): Promise<void> {
        let originalLength = this.cache.length
        for (let i = 0; i < this.sources.length; i++) {
            let info = this.sources[i]
            if (!info.done) {
                let result = await this.searchBySource(info.source, this.query, info.start);
                if (result.length > 0) {
                    this.udpateCache(result)
                    info.start += result.length;
                } else {
                    info.done = true;
                }
            }
        }

        if (this.cache.length <= originalLength) {
            return
        } else if (page * this.pageSize > this.cache.length) {
            await this.fetchAndCache(page)
        }

    }

    async load(page: number = 1) {
        page = Math.max(page, 1)
        if (page * this.pageSize <= this.cache.length) {
            return this.cache.slice((page - 1) * this.pageSize, page * this.pageSize)
        }
        await this.fetchAndCache(page)
        return this.cache.slice((page-1) * this.pageSize)
    }

    close() {
        this.cache = []
    }
}

export { SearchSession }