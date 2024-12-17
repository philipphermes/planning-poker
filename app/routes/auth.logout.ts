import {LoaderFunctionArgs} from "@remix-run/node";
import {logoutUser} from "~/.server/auth/logout";

export async function loader({request}: LoaderFunctionArgs) {
    await logoutUser(request)
}