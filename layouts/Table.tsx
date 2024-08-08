import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Table ({
    columns,
    dataSet,
    extra,
    linkRoot,
    keyLink,
    profix,
    onRowClick, // Thêm callback function
}: {
    columns: {id: number, text: string, key: string, icon?: string, linkRoot?: string, isImage?: boolean}[],
    dataSet: any[],
    extra?: {
        column: {id: number, text: string},
        node: React.ReactNode,
        handleClick: (val: any) => void,
        key: string,
    },
    linkRoot?:string,
    keyLink?:string,
    profix?:string,
    onRowClick?: (row: any) => void, // Thêm callback function
}) {
    const headerCols = [...columns];
    if (extra) {
        headerCols.push({
            ...extra.column,
            key: "",
        })
    }

    const handleRowClick = (row: any) => {
        if (onRowClick) {
            onRowClick(row);
        }
    };

    const getNestedValue = (obj: any, key: string) => {
        return key.split('.').reduce((o, i) => o[i], obj);
    };

    let colsCount = extra ? headerCols.length : columns.length; 
    let count = 0;

    return (
        <section className="flex flex-col h-full">
            <Header columns={headerCols} />
            <main className="mt-1 flex flex-col max-h-[560px] overflow-auto">
            {dataSet.map((row, index) => {
                    const keyValue = keyLink ? getNestedValue(row, keyLink) : row.id;

                    return (
                        linkRoot ? 
                            <Link
                                href={`${linkRoot}${keyValue}${profix}`}
                                key={index} // Cần sử dụng `index` hoặc giá trị duy nhất khác
                                className={`grid grid-cols-${colsCount} min-h-[48px] shrink-0 odd:bg-gray-50 border-2 border-transparent hover:border-gray-300 hover:bg-[#ecf0f1]`}
                            >
                                {columns.map(col => (
                                    <div key={col.key + col.text} 
                                        className="col-span-1 grid place-items-center text-center">
                                        {col.isImage 
                                            ? <div className="relative w-80 h-52">
                                                <Image
                                                    className="object-contain"
                                                    src={getNestedValue(row, col.key)}
                                                    alt="Image"
                                                    fill
                                                />
                                              </div>
                                            : getNestedValue(row, col.key)
                                        }
                                    </div>
                                ))}
                                {extra && 
                                    <div className="col-span-1 grid place-items-center text-center">
                                        <span onClick={() => extra.handleClick(row)}>
                                            {extra.node}
                                        </span>
                                    </div>
                                }
                            </Link> :
                            <div
                                key={index}
                                className={`grid grid-cols-${colsCount} min-h-[48px] shrink-0 odd:bg-gray-50 border-2 border-transparent hover:border-gray-300 hover:bg-[#ecf0f1]`}
                                onClick={() => handleRowClick(row)}
                            >
                                {columns.map(col => (
                                    <div key={col.key + col.text} 
                                        className="col-span-1 grid place-items-center text-center">
                                        {col.isImage 
                                            ? <div className="relative w-80 h-52">
                                                <Image
                                                    className="object-contain"
                                                    src={getNestedValue(row, col.key)}
                                                    alt="Image"
                                                    fill
                                                />
                                              </div>
                                            : getNestedValue(row, col.key)
                                        }
                                    </div>
                                ))}
                                {extra && 
                                    <div className="col-span-1 grid place-items-center text-center">
                                        <span onClick={() => extra.handleClick(row)}>
                                            {extra.node}
                                        </span>
                                    </div>
                                }
                            </div>
                    );
                })}
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
    const headerClassName = `h-11 grid grid-cols-${colsCount} rounded-t-md overflow-hidden text-white`;
    return (
        <header className={headerClassName}>
        {columns.map(col => (
            <div
                key={col.id} 
                className="col-span-1 grid place-items-center font-bold bg-[#34495e] hover:bg-opacity-90">
                {col.text}
            </div>
        ))}
        </header>
    )
}
 