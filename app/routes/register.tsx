import type {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {data, Form, Link, redirect} from "@remix-run/react";
import {getCurrentUser} from "~/.server/auth";
import {createUser} from "~/db/queries/userQueries";
import {userSchema} from "~/validators/userSchema";
import {v4 as uuidV4} from "uuid";
import * as argon2 from "argon2";
import {getAndValidateFormData} from "~/utils/formData";
import {getDataWithToast, redirectWithToast} from "~/utils/toast";

export async function loader({request}: LoaderFunctionArgs) {
    try {
        await getCurrentUser(request, false)
    } catch (error) {
        return data(null)
    }

    throw redirect("/")
}

export async function action({request}: ActionFunctionArgs) {
    const result = await getAndValidateFormData(await request.formData(), request, userSchema)
    if (result.init) return result

    const user = await createUser({
        id: uuidV4(),
        email: result.email,
        password: await argon2.hash(result.password),
    })

    if (!user.id) return await getDataWithToast(request, 'Failed to create your account!', false, null)

    await redirectWithToast(request, 'Your account was created successfully!', true, '/login')
}

export default function Register() {
    return (
        <div
            className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-2xl font-bold leading-9 tracking-tight">
                Sign up
            </h2>

            <div className="mt-10 w-full">
                <Form method="post" className="space-y-6">
                    <label className="form-control w-full">
                        <span className="sr-only">Email</span>
                        <div className="label">
                            <span className="label-text">Email</span>
                        </div>
                        <input type="email" name="email" placeholder="Type here"
                               className="input input-bordered w-full"/>
                    </label>
                    <label className="form-control w-full">
                        <span className="sr-only">Password</span>
                        <div className="label">
                            <span className="label-text">Password</span>
                        </div>
                        <input type="password" name="password" placeholder="********"
                               className="input input-bordered w-full"/>
                    </label>
                    <button type="submit" className="btn btn-outline btn-primary w-full">Sign up</button>
                </Form>
            </div>

            <span className="">Already got an account? Sign in <Link prefetch="intent" to="/login"
                                                                     className="link link-secondary">here</Link></span>
        </div>
    );
}