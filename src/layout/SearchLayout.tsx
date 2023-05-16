import SearchBar from "../components/SearchBar";
import SearchResultList from "./SearchResultList";
import SearchFilterLayout from "./SearchFilterLayout";
import SearchViewLayout, { ViewOption } from "./SearchViewLayout";
import { Category, ViewType } from "../types/enums";
import { useRef, useState } from "react";
import { SearchSession } from "../api/search";
import type { SearchResult } from "../types/model";
import InfiniteScroll from "react-infinite-scroll-component";

type Store = {
    session: SearchSession | null,
    result: SearchResult[],
    page: number,
}

export default function SearchLayout() {
    let categoryOptions = Object.values(Category)
    let viewOptions: ViewOption[] = [
        { type: ViewType.LIST, icon: "fa-solid fa-sharp fa-list" },
        { type: ViewType.GRID, icon: "fa-solid fa-sharp fa-grip-vertical" }
    ]
    let [viewMode, setViewMode] = useState(viewOptions[0].type)
    let [filterCategory, setFilterCategory] = useState<string>(categoryOptions[0])
    let [isLoading, setLoading] = useState(false)
    let [hasMore, setHasMore] = useState(true)
    let [searchResult, setSearchResult] = useState<SearchResult[]>([])
    var storeRef = useRef<Store>({ session: null, result: [], page: 1 })
    const viewChangeListener = (type: ViewType) => {
        setViewMode(type)
    };
    const filterCategoryChangeListener = (value: string) => {
        filterCategory = value
        setFilterCategory(value)
        updateResult()
    }
    const updateResult = () => {
        let store = storeRef.current
        if (filterCategory == Category.ALL) {
            setSearchResult(store.result)
        } else if (store.result.length > 0) {
            setSearchResult(store.result.filter((item) => item.category == filterCategory))
        } else {
            setSearchResult([])
        }
    }
    const onKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == "Enter") {
            setLoading(true)
            setHasMore(true)
            let store = storeRef.current
            let session = await SearchSession.search(event.currentTarget.value)
            store.session = session
            store.page = 1
            let result = await session.load(store.page)
            store.result = result
            updateResult()
            setLoading(false)
        }
    };
    return (
        <div className="max-w-5xl w-screen bg-slate-50 mx-auto p-3 h-screen flex flex-col">
            <SearchBar onKeyDown={onKeyDown} />
            <div className="flex space-x-4 mt-3 grow h-0">
                <SearchFilterLayout filterOptions={categoryOptions} filterCategory={filterCategory} onSelectedChange={filterCategoryChangeListener} />
                <div id='SearchResultContainer' className="flex-auto relative overflow-y-auto">
                    {
                        isLoading ? ((<div className="text-center absolute left-1/2 top-1/2">加载中...</div>)) :
                            searchResult.length > 0 ? (<InfiniteScroll
                                scrollableTarget='SearchResultContainer'
                                dataLength={searchResult.length}
                                next={async () => {
                                    let store = storeRef.current
                                    if (store.session != null) {
                                        let newPage = await store.session.load(++store.page)
                                        if (newPage.length == 0) {
                                            setHasMore(false)
                                        } else {
                                            store.result = [...store.result, ...newPage]
                                            updateResult()
                                        }
                                    }
                                }}
                                scrollThreshold={0.6}
                                hasMore={hasMore}
                                loader={(<></>)}
                                endMessage={<h4 className="text-center py-3">已经到底了</h4>}
                            ><SearchResultList viewMode={viewMode} items={searchResult} /></InfiniteScroll>) : (<div className="grow text-center absolute left-1/2 top-1/2"></div>)
                    }

                </div>
                <SearchViewLayout viewOptions={viewOptions} changeListener={viewChangeListener} />
            </div>
        </div>
    );
}