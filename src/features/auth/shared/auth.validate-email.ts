export function isValidEmail(email: string, allowedDomains?: string[]): boolean {
    const domains = allowedDomains ?? (process.env.NEXTAUTH_ALLOWED_DOMAINS !== '' ? process.env.NEXTAUTH_ALLOWED_DOMAINS?.split(',') : []) ?? [];

    if (domains.length === 0) {
        return true;
    }

    const userDomain = email.split('@', 2).pop();

    if (!userDomain) {
        return false;
    }

    return domains.includes(userDomain);
}