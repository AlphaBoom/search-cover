import GridItem from "../components/GridItem";
import ListItem from "../components/ListItem";
import { ViewType } from "../types/enums";
import type { SearchResult } from "../types/model";

type Props = {
    viewMode: ViewType,
    items:SearchResult[],
}

export default function SearchResultList({viewMode, items}: Props) {
    return (
        <>
            {viewMode == ViewType.GRID ?
                <div className="grid gap-4 justify-items-center" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))` }}>
                    {
                        items.map((item) => (<GridItem key={item.key??""} item={item}/>))
                    }
                </div>
                :
                <ul>
                    {
                        items.map((item) => (<ListItem key={item.key??""} item={item}/>))
                    }
                </ul>}
        </>
    )
}