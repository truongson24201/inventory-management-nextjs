import React, { ChangeEvent, useState } from "react";
import Icon from "./Icon";

export default function EditTextLong({
    label,
    icon,
    handleChange,
    value,
    type = "text",
    errorText = "",
    disabled,
    min,
    isLongText = false, // New prop to handle long text
}: {
    label: string,
    icon: string,
    type?: string,
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    value: string | number,
    errorText: string,
    disabled?: boolean,
    min?: string,
    isLongText?: boolean, // Optional prop to handle long text
}) {
    let className = `px-3 flex place-items-center border-2 rounded-md ${isLongText ? 'h-auto' : 'h-10'}`;
    let inputClassName = `w-full pl-2 bg-transparent border-l-2 ${isLongText ? 'whitespace-normal break-words' : ''}`;
    let classNameError = className + " border-red-400";
    const [isError, setIsError] = useState(!!errorText);

    return (
        <div className="flex flex-col">
            <label className={isError ? classNameError : className}>
                <span className="w-12"><Icon name={icon} size="xl" /></span>
                <span className="w-40 font-bold">{label}</span>
                {isLongText ? (
                    <textarea
                        className={inputClassName}
                        name={label}
                        onChange={(e) => {
                            handleChange(e);
                            setIsError(false);
                        }}
                        value={value as string}
                        disabled={disabled}
                    />
                ) : (
                    <input
                        className={inputClassName}
                        name={label}
                        type={type}
                        onChange={(e) => {
                            handleChange(e);
                            setIsError(false);
                        }}
                        value={value}
                        disabled={disabled}
                        min={min}
                    />
                )}
            </label>
            {isError && <p className="pl-5 text-red-500 font-semibold">{errorText}</p>}
        </div>
    );
}
