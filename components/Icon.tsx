export default function Icon({
    name,
    size
}: {
    name: string,
    size?:  'lg' | 'xl' | '2xl' | '3xl'
}) {
    return (
        <i className={`fa-solid fa-${name} ` + (size && ` fa-${size}`)}></i>
    )
}