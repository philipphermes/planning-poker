import React from "react";

export type Input = {
    type: React.HTMLInputTypeAttribute;
    name: string;
    placeholder: string;
    label?: string | undefined;
    value?: string | number | readonly string[] | undefined;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
    icon?: React.ReactNode;
    className?: string | undefined;
}

export function InputWithLabel({type, name, placeholder, label, value, onChange, className}: Input) {
    return (
        <label className="form-control w-full">
            <span className="sr-only">{label}</span>
            <div className="label">
                <span className="label-text">{label}</span>
            </div>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`input w-full ` + (className ?? '')}
            />
        </label>
    )
}

export function InputWithIcon({type, name, placeholder, icon, value, onChange, className}: Input) {
    return (
        <label className={`w-full input flex items-center ` + (className ?? '')}>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full"
            />{icon}</label>
    )
}

