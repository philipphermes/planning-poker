import { data, LoaderFunctionArgs } from "@remix-run/node";
import { findUsers } from "~/db/queries/userQueries";

export async function loader({ request }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const query = url.searchParams.get("query");

    if (!query) {
        return data({ results: [] });
    }

    return data(await findUsers(query))
}