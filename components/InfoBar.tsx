import Icon from "./Icon";

export default function InfoBar({
    label,
    value,
    icon
}: {
    label: string,
    value?: string | number,
    icon: string,
}) {
    let className = "flex px-3 place-items-center h-10 bg-gray-100 rounded-md hover:bg-gray-200";
    return (
        <div className={className}>
            <span className="w-12"><Icon name={icon} size="xl" /></span>
            <span className="w-40 font-bold">{label}</span>
            <span className="w-full">{value}</span>
        </div>  
    )
}