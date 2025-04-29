import { getSession } from "~/utils/session.server";
import { redirect } from "@remix-run/node";

export async function requireUser(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    const user = session.get("user");

    if (!user) {
        throw redirect("/login");
    }

    return user;
}

export async function redirectForAuthenticatedUser(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    const user = session.get("user");

    if (user) {
        throw redirect("/dashboard");
    }
}
