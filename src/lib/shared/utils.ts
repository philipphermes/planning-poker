import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import sanitizeHtml from 'sanitize-html';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function sanitizeOptional(input?: string | null) {
    if (!input) return input;

    return sanitize(input);
}

export function sanitize(input: string) {
    return sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'discard',
        textFilter: (text: string) => text.trim(),
    });
}