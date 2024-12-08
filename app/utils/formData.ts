import {Toast} from "~/models/Toast";
import {addToastMessages} from "~/.server/toasts";
import {sessionStorage} from "~/.server/session";
import {ZodObject, ZodRawShape, SafeParseReturnType} from "zod";
import {data} from "@remix-run/react";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function getAndValidateFormData<T extends ZodRawShape>(
    formData: FormData,
    request: Request,
    validator: ZodObject<T>
): Promise<SafeParseReturnType<T, any>['data'] | ReturnType<typeof data>> {
    const formDataEntries = Object.fromEntries(formData);
    const result = validator.safeParse(formDataEntries);

    console.log(result);

    if (!result.success) {
        const errors: Toast[] = result.error.errors.map((error) => {
            return new Toast(error.message, false);
        });

        const session = await addToastMessages(request, errors);

        return data(null, {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session),
            },
        });
    }

    return result.data;
}