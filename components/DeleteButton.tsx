import Icon from "./Icon";

export default function DeleteButton() {
    return (
        <button className="w-10 h-10 text-white bg-pink-600 rounded-md hover:bg-opacity-80">
            <Icon
                name="trash-can"
                size="lg"
            />
        </button>
    )
}