import Icon from "./Icon";

export default function InfoBarLongText({
    label,
    value,
    icon,
    isLongText = false, // Thêm thuộc tính này để xử lý trường hợp văn bản dài
}: {
    label: string,
    value?: string | number,
    icon: string,
    isLongText?: boolean, // Thuộc tính tùy chọn
}) {
    let className = `flex px-3 place-items-center h-10 bg-gray-100 rounded-md hover:bg-gray-200 ${isLongText ? 'h-auto' : ''}`;
    let valueClassName = `w-full ${isLongText ? 'whitespace-normal break-words' : ''}`;
    
    return (
        <div className={className}>
            <span className="w-12"><Icon name={icon} size="xl" /></span>
            <span className="w-40 font-bold">{label}</span>
            <span className={valueClassName}>{value}</span>
        </div>
    );
}