import {ZodObject, ZodRawShape, SafeParseReturnType} from "zod";
import {data} from "@remix-run/react";
import {ToastMessage} from "remix-toast-notifications";
import {toast} from "~/.server/toast/toast";

export type ParsedFormData = Record<string, string | Map<string, string>>

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

/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function getAndValidateParsedData<T extends ZodRawShape>(
    parsedData: ParsedFormData,
    request: Request,
    validator: ZodObject<T>
): Promise<SafeParseReturnType<T, any>['data'] | ReturnType<typeof data>> {
    const result = validator.safeParse(parsedData);

    if (!result.success) {
        const errors: ToastMessage[] = result.error.errors.map((error) => {
            return {message: error.message, status: 'error'};
        });

        return await toast.getDataWithToasts(request, errors, null)
    }

    return result.data;
}

export function parseFormDataToNestedMap(formData: FormData) {
    const parsedData: Record<string, string | Map<string, string>> = {};

    formData.forEach((value, key) => {
        if (key.includes('[') && key.includes(']')) {
            const baseKey = key.split('[')[0];
            const subKey = key.match(/\[(.*?)\]/)?.[1];

            if (subKey) {
                if (!parsedData[baseKey]) {
                    parsedData[baseKey] = new Map<string, string>();
                }

                const subMap = parsedData[baseKey] as Map<string, string>;
                subMap.set(subKey, value.toString());
            }
        } else {
            parsedData[key] = value.toString();
        }
    });

    return parsedData;
}