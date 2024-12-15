import {ZodObject, ZodRawShape, SafeParseReturnType} from "zod";
import {data} from "@remix-run/react";
import {ToastMessage} from "remix-toast-notifications";
import {toast} from "~/.server/toast";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function getAndValidateFormData<T extends ZodRawShape>(
    formData: FormData,
    request: Request,
    validator: ZodObject<T>
): Promise<SafeParseReturnType<T, any>['data'] | ReturnType<typeof data>> {
    const formDataEntries = Object.fromEntries(formData);
    const result = validator.safeParse(formDataEntries);

    if (!result.success) {
        const errors: ToastMessage[] = result.error.errors.map((error) => {
            return {message: error.message, status: 'error'};
        });

        return await toast.getDataWithToasts(request, errors, null)
    }

    return result.data;
}