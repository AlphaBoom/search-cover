import type {ViewType} from '../types/enums'
import { useState } from 'react'

export type ViewOption = {
    type:ViewType,
    icon:string,
}

type Props = {
    viewOptions:ViewOption[],
    changeListener?:(type:ViewType)=>void
}

export default function SearchViewLayout(props:Props) {
    let [selected, setSelected] = useState(0)
    return (
        <ul>
        {props.viewOptions.map((option, index)=>(
            (selected != index) ?
            <li key={index} className='hover:text-white hover:bg-gray-500 p-2 rounded mb-1 text-center text-2xl' onClick={()=>{
                props.changeListener?.(option.type)
                setSelected(index)
            }}>
                <i className={option.icon} />
            </li> :
            <li key={index} className='p-2 rounded mb-1 text-center text-2xl text-white bg-blue-500'>
                <i className={option.icon}/>
            </li>
        ))}
        </ul>
    )
}