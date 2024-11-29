import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { data, Form, Link, redirect } from "@remix-run/react";
import { getCurrentUser } from "~/.server/auth";
import { sessionStorage } from "~/.server/session";
import { addToastMessages } from "~/.server/toasts";
import { createUser } from "~/db/queries/userQueries";
import { Toast } from "~/models/Toast";
import { User } from "~/models/User";
import { userSchema } from "~/validators/userSchema";

export async function loader({ request }: LoaderFunctionArgs) {
    let user: User

    try {
        user = await getCurrentUser(request, false)
    } catch (error) {
        return data(null)
    }

    throw redirect("/")
};

export async function action({ request }: ActionFunctionArgs) {
    const formData = Object.fromEntries(await request.formData())
    const result = userSchema.safeParse(formData);

    if (!result.success) {
        const errors: Toast[] = result.error?.errors.map(error => {
            return new Toast(error.message, false)
        })

        const session = await addToastMessages(request, errors)

        return data(null, {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session)
            }
        })
    }

    const user = await createUser(new User(result.data.email, undefined, result.data.password))

    if (!user.id) {
        const session = await addToastMessages(request, [new Toast('Failed to create your account!', false)])
        return data(null, {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session)
            }
        })
    }

    const session = await addToastMessages(request, [new Toast('Your account was created successfully!', true)])
    return redirect("/login", {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
};

export default function Register() {
    return (
        <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-2xl font-bold leading-9 tracking-tight">
                Sign up
            </h2>

            <div className="mt-10 w-full">
                <Form method="post" className="space-y-6">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Email</span>
                        </div>
                        <input type="email" name="email" placeholder="Type here" className="input input-bordered w-full" />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Password</span>
                        </div>
                        <input type="password" name="password" placeholder="********" className="input input-bordered w-full" />
                    </label>
                    <button type="submit" className="btn btn-outline btn-primary w-full">Sign up</button>
                </Form>
            </div>

            <span className="">Already got an account? Sign in <Link prefetch="intent" to="/login" className="link link-secondary">here</Link></span>
        </div>
    );
}