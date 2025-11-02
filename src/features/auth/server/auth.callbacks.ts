import {JWT} from "next-auth/jwt";
import {DefaultUser, Theme, User} from "next-auth";
import {isValidEmail} from "@/features/auth/shared/auth.validate-email";
import { createTransport } from "nodemailer"
import {SendVerificationRequestParams} from "next-auth/providers/email";

export const signInCallback = async ({user}: { user: User }) => {
    if (!user.email) {
        return false;
    }

    return isValidEmail(user.email);
};

export const jwtCallback = async ({token, trigger, session}: {
    token: JWT,
    trigger?: "signIn" | "signUp" | "update",
    session?: DefaultUser
}) => {
    if (trigger === 'update') {
        token.name = session?.name;
        token.picture = session?.image;
    }

    return token;
}

export const sendVerificationRequest = async (params: SendVerificationRequestParams) => {
    const { identifier, url, expires, provider, theme } = params

    const date = new Date();
    const requestTime = formatDateTime(date);
    const expiredIn = formatExpireTime(date, expires);

    const transport = createTransport(provider.server)
    const result = await transport.sendMail({
        to: identifier,
        from: provider.from,
        subject: `Continue to Planning Poker`,
        text: text({ url, requestTime, expiredIn, email: provider.from }),
        html: html({ url, theme, requestTime, expiredIn, email: provider.from }),
    })
    const failed = result.rejected.concat(result.pending).filter(Boolean)
    if (failed.length) {
        throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
    }
}

function html(params: { url: string, theme: Theme, requestTime: string, expiredIn: string, email: string }) {
    const { url, theme, requestTime, expiredIn, email } = params

    const brandColor = theme.brandColor ?? "#343434";

    const color = {
        background: "#ffffff",
        text: "#252525",
        main: "#f7f7f7",
        primary: brandColor,
        primaryText: theme.buttonText ?? "#fafafa"
    }

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background: ${color.background}; margin: 0; padding: 16px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0; padding: 0;">
    <tr>
        <td align="center" style="padding: 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                   style="background: ${color.main}; width: 100%; max-width: 600px; margin: 0 auto; border-radius: 10px; padding: 20px; box-sizing: border-box;">
                <tr>
                    <td style="padding: 10px 0; font-size: 22px; font-family: Helvetica, Arial, sans-serif; text-align: center; color: ${color.text}; line-height: 1.3;">
                        Continue to <strong>Planning Poker</strong>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 10px 0; font-size: 14px; font-family: Helvetica, Arial, sans-serif; text-align: center; color: ${color.text}; line-height: 20px;">
                        A login request was made on <strong>${requestTime}</strong>.
                    </td>
                </tr>
                
                <tr>
                    <td align="center" style="padding: 10px 0; font-size: 14px; line-height: 20px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
                        You’re receiving this because you requested a login to Planning Poker.
                    </td>
                </tr>
                
                <tr>
                    <td align="center" style="padding: 10px 0; font-size: 14px; line-height: 20px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
                        If you did not request this email you can safely ignore it.
                    </td>
                </tr>

                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center" style="border-radius: 10px; background-color: ${color.primary};">
                                   <a
                                       href="${url}"
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       aria-label="Sign in to Planning Poker"
                                       style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.primaryText}; text-decoration: none; border-radius: 10px; padding: 12px 24px; display: inline-block; font-weight: bold; text-align: center; line-height: 1; mso-padding-alt:0;"
                                       class="button"
                                   >Sign in</a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 5px 0; font-size: 14px; font-family: Helvetica, Arial, sans-serif; text-align: center; color: ${color.text}; line-height: 20px;">
                        This link will expire in <strong>${expiredIn}</strong>.
                    </td>
                </tr>
                
                <tr>
                    <td align="center" style="padding: 5px 0; font-size: 12px; line-height: 16px; font-family: Helvetica, Arial, sans-serif; color: #666;">
                        © 2025 Planning Poker · <a href="mailto:${email}" style="color:#666; text-decoration: underline;">${email}</a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
`
}

function text({ url, requestTime, expiredIn, email }: { url: string, requestTime: string, expiredIn: string, email: string }) {
    return `
Continue to Planning Poker

A login request was made on: ${requestTime}

You’re receiving this because you requested a login to Planning Poker.

If you did not request this email you can safely ignore it.

Use the link below to login. This link will expire in ${expiredIn}.

${url}

Thank you,
Planning Poker

© 2025 Planning Poker · ${email}
`
}

function formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatExpireTime(currentDate: Date, date: Date): string {
    const diff = date.getTime() - currentDate.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${days} days, ${hours} hours, ${minutes} minutes`;
}