import Icon from "./Icon";

export default function SearchInput({
    placeholder
}: {
    placeholder: string
}) {
    return (
        <div className="h-full py-1 pl-2 border-2 rounded-md overflow-hidden">
            <input 
                className="h-full " 
                type="text"
                placeholder={placeholder}    
            />
            <button
                className="px-2"
                onClick={() => {}}
            >
                <Icon
                    name="magnifying-glass"
                    size="lg"
                />
            </button>
        </div>
    )
}