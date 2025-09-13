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
    const { identifier, url, provider, theme } = params
    const transport = createTransport(provider.server)
    const result = await transport.sendMail({
        to: identifier,
        from: provider.from,
        subject: 'Sign in to Planning Poker',
        text: text({ url }),
        html: html({ url, theme }),
    })
    const failed = result.rejected.concat(result.pending).filter(Boolean)
    if (failed.length) {
        throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
    }
}

function html(params: { url: string, theme: Theme }) {
    const { url, theme } = params

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
<body style="background: ${color.background} margin: 0; padding: 16px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0; padding: 0;">
    <tr>
        <td align="center" style="padding: 0;">
            <!-- Main content table -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                   style="background: ${color.main}; width: 100%; max-width: 600px; margin: 0 auto; border-radius: 10px; padding: 20px; box-sizing: border-box;">

                <!-- Title Row -->
                <tr>
                    <td style="padding: 10px 0; font-size: 22px; font-family: Helvetica, Arial, sans-serif; text-align: center; color: ${color.text}; line-height: 1.3;">
                        Sign in to <strong>Planning Poker</strong>
                    </td>
                </tr>

                <!-- Button Row -->
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center" style="border-radius: 10px; background-color: ${color.primary};">
                                   <a
                                       style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.primaryText}; text-decoration: none; border-radius: 10px; padding: 12px 24px; display: inline-block; font-weight: bold; text-align: center; line-height: 1;"
                                       href="${url}"
                                       target="_blank"
                                       rel="noopener noreferrer"
                                   >Sign in</a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Footer Row -->
                <tr>
                    <td align="center"
                        style="padding: 0 0 10px 0; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
                        If you did not request this email you can safely ignore it.
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

function text({ url }: { url: string }) {
    return `Sign in to Planning Poker\n${url}\n\n`
}