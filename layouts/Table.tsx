import Link from "next/link";

export default function Table ({
    columns,
    dataSet,
}: {
    columns: {id: number, text: string, key: string, icon?: string, linkRoot?: string}[],
    dataSet: any[]
}) { 
    const colsCount = columns.length;

    return (
        <section className="flex flex-col h-full">
            <Header columns={columns} />

            <main className="mt-1 flex flex-col max-h-[560px] overflow-auto">
            {dataSet.map(row => (
                <div className={`grid grid-cols-${colsCount} h-12 shrink-0 odd:bg-gray-50 border-2 border-transparent hover:border-gray-300 hover:bg-[#ecf0f1]`}>
                {columns.map(col => (
                    <div className="col-span-1 grid place-items-center">
                    {col.linkRoot
                        ? <Link className="text-blue-400 underline" href={col.linkRoot + row[col.key]}>{row[col.key]}</Link>
                        : row[col.key]
                    }
                    </div>
                ))}
                </div>
            ))}
            </main>
        </section>
    )
}

export const enum ColType {
    Text = "text",
    Link = "link"
}
function Header({
    columns
}: {
    columns: {id: number, text: string, key: string, icon?: string}[],
}) {
    const colsCount = columns.length;
    
    return (
        <header className={`h-11 grid grid-cols-${colsCount} rounded-t-md overflow-hidden text-white`}>
        {columns.map(col => (
            <div className="col-span-1 grid place-items-center font-bold bg-[#34495e] hover:bg-opacity-90">
                {col.text}
            </div>
        ))}
        </header>
    )
}
 