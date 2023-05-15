import type { SearchResult } from "../types/model";

export default function ListItem({ item }: { item: SearchResult }) {
    return (
        <li className="flex mb-3 space-x-3" style={{height:200}}>
            <div className="overflow-hidden rounded object-cover flex-none shadow w-36 h-48" onClick={()=>{
                navigator.clipboard.writeText(item.imageUrl).then(()=>{
                    alert("已复制到剪贴板")
                })
            }}>
                <img src={item.imageUrl} className="w-full h-full object-cover hover:scale-125 duration-150" draggable="false" loading="lazy" title="copy to clipboard"/>
            </div>
            <div className="ml-150 h-full">
                <h3 className="text-black font-bold truncate">{item.title}</h3>
                <p className="text-gray-500 text-ellipsis overflow-hidden mt-1" style={{WebkitLineClamp:3, WebkitBoxOrient:'vertical', display:'-webkit-box'}}>{item.description}</p>
            </div>
        </li>
    )
}