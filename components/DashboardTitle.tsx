import { Color } from "@/utils/constants/colors";
import Icon from "./Icon";

export default function Title({
    text,
    icon,
    color = Color.BLACK
}: {
    text: string,
    icon?: string,
    color?: Color
}) {
    return (
        <h3 className={`flex items-center gap-1 justify-center text-${color} text-xl font-bold`}>
            {text}
            {icon && <Icon name={icon} />}
        </h3>
    )
    
}