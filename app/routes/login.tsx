import type {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {data, Form, Link, redirect} from "@remix-run/react";
import {getCurrentUser, loginUser} from "~/.server/auth";
import {User} from "~/models/User";

export async function action({request}: ActionFunctionArgs) {
    await loginUser(request)
}

export async function loader({request}: LoaderFunctionArgs) {
    let user: User

    try {
        user = await getCurrentUser(request, false)
    } catch (error) {
        return data(null)
    }

    throw redirect("/")
}

export default function Login() {
    return (
        <div
            className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-2xl font-bold leading-9 tracking-tight">
                Sign in to your account
            </h2>

            <div className="mt-10 w-full">
                <Form method="post" className="space-y-6">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Email</span>
                        </div>
                        <input type="email" name="email" placeholder="Type here"
                               className="input input-bordered w-full"/>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Password</span>
                        </div>
                        <input type="password" name="password" placeholder="********"
                               className="input input-bordered w-full"/>
                    </label>
                    <button type="submit" className="btn btn-outline btn-primary w-full">Sign in</button>
                </Form>
            </div>

            <span className="">No account? Sign up <Link prefetch="intent" to="/register"
                                                         className="link link-secondary">here</Link></span>
        </div>
    );
}