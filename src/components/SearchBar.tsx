type Props = {
	onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function SearchBar(props: Props) {

    return (
        <div className="relative mx-10">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-search"
					width={24}
					height={24}
					viewBox="0 0 24 24"
					strokeWidth="2"
					stroke="currentColor"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<circle cx={10} cy={10} r={7}></circle>
					<line x1={21} y1={21} x2={15} y2={15}></line>
				</svg>
            </div>
            <input type="text" onKeyDown={props.onKeyDown}  placeholder="请输入搜索关键字" className="block w-full p-4 pl-10 text-sm 
                                text-gray-900 
                                border border-gray-300
                                rounded-lg bg-gray-50
                                focus:outline-none
                                focus:ring-blue-500
                                focus:border-blue-500"></input>
        </div>
    )
}