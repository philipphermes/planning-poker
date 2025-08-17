import {describe, expect, it} from "vitest";
import {jwtCallback, signInCallback} from "../../../../src/features/auth/server/auth.callbacks";
import {JWT} from "next-auth/jwt";
import {DefaultUser} from "next-auth";

describe('auth callbacks', () => {
    describe('signInCallback', () => {
        it('should return true when called', async () => {
            delete process.env.NEXTAUTH_ALLOWED_DOMAINS;

            const isValid = await signInCallback({user: {email: 'test@email.com'}})

            expect(isValid).toBe(true);
        })

        it('should return false when email was not provided', async () => {
            delete process.env.NEXTAUTH_ALLOWED_DOMAINS;

            const isValid = await signInCallback({user: {}})

            expect(isValid).toBe(false);
        })

        it('should return false when email is not valid', async () => {
            process.env.NEXTAUTH_ALLOWED_DOMAINS = 'mail.com';

            const isValid = await signInCallback({user: {email: 'test@email.com'}})

            expect(isValid).toBe(false);
        })
    });

    describe('jwtCallback', () => {
        it('should update session with token data on update trigger', async () => {
            const jwtToken = {
                name: null,
                picture: null,
            } as JWT;

            const session = {
                name: 'update',
                image: 'test.png'
            } as DefaultUser;

            const token = await jwtCallback({token: jwtToken, session: session, trigger: 'update'});

            expect(token.name).toBe('update');
            expect(token.picture).toBe('test.png');
        })

        it('should do nothing on signIn and signUp trigger', async () => {
            const jwtToken = {
                name: null,
                picture: null,
            } as JWT;

            const session = {
                name: 'update',
                image: 'test.png'
            } as DefaultUser;

            const tokenSignIn = await jwtCallback({token: jwtToken, session: session, trigger: 'signIn'});
            const tokenSignUp = await jwtCallback({token: jwtToken, session: session, trigger: 'signUp'});

            expect(tokenSignIn.name).toBeNull();
            expect(tokenSignIn.picture).toBeNull();

            expect(tokenSignUp.name).toBeNull();
            expect(tokenSignUp.picture).toBeNull();
        })
    })
})