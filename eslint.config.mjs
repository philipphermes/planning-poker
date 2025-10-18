import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: ["next", "next/core-web-vitals", "next/typescript"],
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-explicit-any": "off",
        },
    }),
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
            "tests/**",
            "coverage/**",
            "*.cjs",
        ],
    }
]
export default eslintConfig