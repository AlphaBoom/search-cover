import type { SearchResult } from "../types/model";

export default function GridItem({ item }: { item: SearchResult }) {
    return (
        <div className="w-48 h-64 overflow-hidden rounded shadow-md" onClick={()=>{
            navigator.clipboard.writeText(item.imageUrl).then(()=>{
                alert("已复制到剪贴板")
            })
        }}>
            <img className="w-full h-full hover:scale-125 duration-150 object-cover" src={item.imageUrl} draggable="false" title="copy to clipboard" />
        </div>
    )
}