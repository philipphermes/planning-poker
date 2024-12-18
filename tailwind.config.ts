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
        '[transform:rotateY(180deg)]'
    ]
} satisfies Config;
