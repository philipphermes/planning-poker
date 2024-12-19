import type {Config} from "tailwindcss";

export default {
    content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
    theme: {},
    daisyui: {
        themes: ["sunset"],
    },
    plugins: [
        require('daisyui'),
    ],
    safelist: [
        'translate-y-0',
        'opacity-100',
        'translate-y-10',
        'opacity-0',
        'alert-error',
        'alert-success',
        '[transform:rotateY(180deg)]',
        'grid-cols-2',
        'grid-cols-4',
        'grid-cols-6',
        'grid-cols-8',
        'md:grid-cols-2',
        'md:grid-cols-4',
        'md:grid-cols-6',
        'md:grid-cols-8'
    ]
} satisfies Config;
