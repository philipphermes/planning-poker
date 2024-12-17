import type {Config} from "tailwindcss";

export default {
    content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            keyframes: {
                flipCard: {
                    '0%': {
                        transform: 'rotateY(180deg)',
                        opacity: '0',
                    },
                    '50%': {
                        opacity: '0.5',
                    },
                    '100%': {
                        transform: 'rotateY(0deg)',
                        opacity: '1',
                    }
                },
            },
            animation: {
                flipCard: 'flipCard 0.5s ease-in-out',
            },
        }
    },
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
    ]
} satisfies Config;
