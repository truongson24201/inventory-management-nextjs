import { ChangeEvent } from "react"

export default function ComboBox({
    label,
    dataset,
    handleChange
}: {
    label: string,
    dataset: {
        text: string,
        value: string | number
    }[],
    handleChange: (e: ChangeEvent<HTMLSelectElement>) => void
}) {
    return (
        <label className="flex gap-3 items-center">
            {label}
            <select 
                className="w-52 h-full border-2 rounded-md"
                onChange={handleChange}
            >
            {
                dataset.map(item => (
                    <option className="text-center" value={item.value}>{item.text}</option>
                ))
            }
            </select>
        </label>
    )
}