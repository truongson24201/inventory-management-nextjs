import { ChangeEvent } from "react";
import Icon from "./Icon";

export interface IDropdownData {
    text: string,
    value: string | number,
}

export interface ICheckBox {
    label: string,
    value: string | number,
}

export default function DropDown({
    label,
    icon,
    dataset,
    handleChange,
    value,
    disabled
}: {
    label: string,
    icon: string,
    dataset: IDropdownData[],
    handleChange: (e: ChangeEvent<HTMLSelectElement>) => void,
    value?: string | number,
    disabled?: boolean | undefined,
}) {
    return (
        <label className="h-10 flex place-items-center px-3 outline-none border-2 rounded-md ">
            <span className="w-12"><Icon name={icon} size="xl" /></span>
            <span className="w-40 font-bold">{label}</span>
            
            <select 
                className="w-full h-full pl-2 outline-none border-l-2"
                onChange={handleChange}
                disabled={disabled}               
            >
                {dataset.map(data => 
                    <option key={data.value} value={data.value} selected={value == data.value}>{data.text}</option>    
                )}
            </select>
        </label>
    )
}