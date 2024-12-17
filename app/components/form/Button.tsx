export type Button = {
    text: string;
    type: "submit" | "reset" | "button"
    name?: string | undefined;
    className?: string | undefined;
}

export function Button({text, type, name, className}: Button) {
    return (
        <button
            type={type}
            name={name}
            className={`btn ` + (className ?? '')}
        >
            {text}
        </button>
    )
}