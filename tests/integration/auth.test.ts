// @ts-nocheck

import { describe, expect, it } from "vitest";
import {loginUser} from "~/.server/auth";

describe('auth.ts', () => {
    it('redirects to /login with invalid credentials', async () => {
        const formData = new FormData();
        formData.append('email', 'invalid@email.com');
        formData.append('password', 'wrongpassword');

        const mockRequest = new Request('http://localhost/login', {
            method: 'POST',
            body: formData
        });

        try {
            await loginUser(mockRequest);
        } catch (response) {
            expect(response.status).toBe(302);
            expect(response.headers.get('location')).toBe('/login');
        }
    });

    it('redirects to /login with missing formData', async () => {
        const formData = new FormData();

        const mockRequest = new Request('http://localhost/login', {
            method: 'POST',
            body: formData
        });

        try {
            await loginUser(mockRequest);
        } catch (response) {
            expect(response.status).toBe(302);
            expect(response.headers.get('location')).toBe('/login');
        }
    });

    it('redirects to /login with invalid formData', async () => {
        const formData = new FormData();
        formData.append('email', 'invalid');
        formData.append('password', 'short');

        const mockRequest = new Request('http://localhost/login', {
            method: 'POST',
            body: formData
        });

        try {
            await loginUser(mockRequest);
        } catch (response) {
            expect(response.status).toBe(302);
            expect(response.headers.get('location')).toBe('/login');
        }
    });

    it('redirects to / when credentials are valid', async () => {
        const formData = new FormData();
        formData.append('email', 'test1@email.com');
        formData.append('password', 'password1');

        const mockRequest = new Request('http://localhost/login', {
            method: 'POST',
            body: formData
        });

        try {
            await loginUser(mockRequest);
        } catch (error) {
            expect(error.status).toBe(302);
            expect(error.headers.get('location')).toBe('/');
        }
    });
});
