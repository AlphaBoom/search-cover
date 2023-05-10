type Props = {
    filterOptions: string[],
    filterCategory: string,
    onSelectedChange: (value:string)=>void
}
export default function SearchFilterLayout({ filterOptions, filterCategory, onSelectedChange}: Props) {
    return (
        <ul>
            {filterOptions.map((value, index) => {
                if (filterCategory == value) {
                    return (<li key={index} className="text-white bg-blue-500 p-2 rounded min-w-max mb-1 select-none">{value}</li>)
                } else {
                    return (
                        <li key={index} className="hover:bg-gray-500 hover:text-white p-2 rounded min-w-max mb-1 select-none" onClick={() => {
                            onSelectedChange(value)
                        }}>{value}</li>)
                }
            })}
        </ul>
    )
}