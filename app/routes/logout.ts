import {LoaderFunctionArgs} from "@remix-run/node";
import {logoutUser} from "~/.server/auth";

export async function loader({request}: LoaderFunctionArgs) {
    await logoutUser(request)
}