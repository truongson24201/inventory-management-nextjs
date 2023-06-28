import Icon from "../components/Icon";

export default function Header({
    children,
}: {
    children: React.ReactNode, // More general & reusable
}) {
    return (
        <header className="flex justify-between w-full px-4 h-14 items-center">
            { children }
            <section className="flex items-center gap-2 text-base"> 
                <Action icon="bell" size="lg" />
                <Action icon="circle-question" size="lg" />
                <Action icon="user-circle" size="2xl" />
            </section>
        </header>
    )
}

function Action({
    icon,
    size
}: {
    icon: string,
    size?: 'lg' | 'xl' | '2xl' | '3xl'
}) {
    return (
        <div className="w-11 grid place-items-center aspect-square hover:bg-gray-100 rounded-full cursor-pointer ">
            <Icon name={icon} size={size} />
        </div>
    )
}