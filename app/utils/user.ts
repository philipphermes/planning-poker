export function getEmailInitials(email: string) {
    const localPart = email.split('@')[0];
    let initials

    if (localPart.includes('.')) {
        const parts = localPart.split('.');
        initials = parts[0][0] + parts[1][0];
    } else {
        initials = localPart[0] + localPart[1];
    }

    return initials.toUpperCase();
}