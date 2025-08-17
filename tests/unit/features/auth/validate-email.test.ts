import {describe, expect, it} from "vitest";
import {isValidEmail} from "../../../../src/features/auth/shared/auth.validate-email";

describe('validate email', () => {
    it('should return true when env allowed domains has domains and email has domain in list', () => {
        process.env.NEXTAUTH_ALLOWED_DOMAINS = 'mail.com,test.com';

        const isValid = isValidEmail('test@test.com');

        expect(isValid).toEqual(true);
    });

    it('should return true when allowed domains was passed has domains and email has domain in list', () => {
        const isValid = isValidEmail('test@test.com', ['mail.com', 'test.com']);

        expect(isValid).toEqual(true);
    });

    it('should return true when allowed domains is not set', () => {
        const isValid = isValidEmail('test@test.com', []);

        expect(isValid).toEqual(true);
    });

    it('should return true when allowed domains is not set in env', () => {
        delete process.env.NEXTAUTH_ALLOWED_DOMAINS
        const isValid = isValidEmail('test@test.com');

        expect(isValid).toEqual(true);
    });

    it('should return true when allowed domains is not set in env with empty string', () => {
        process.env.NEXTAUTH_ALLOWED_DOMAINS = '';
        const isValid = isValidEmail('test@test.com');

        expect(isValid).toEqual(true);
    });

    it('should return false when domain is not in list', () => {
        process.env.NEXTAUTH_ALLOWED_DOMAINS = 'mail.com';
        const isValid = isValidEmail('test@test.com');

        expect(isValid).toEqual(false);
    });

    it('should return false when invalid mail was provided', () => {
        process.env.NEXTAUTH_ALLOWED_DOMAINS = 'mail.com';
        const isValid = isValidEmail('test@');

        expect(isValid).toEqual(false);
    });
});