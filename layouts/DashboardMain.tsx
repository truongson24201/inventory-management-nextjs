export default function Main({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <section className="h-full border-t-2 p-4 bg-gray-100">
            <div className="w-full h-full p-3 bg-white border-2 rounded-md">
                {children}
            </div>
        </section>
    )
}