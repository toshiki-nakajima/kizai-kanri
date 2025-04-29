import { getSession } from "~/utils/session.manager.server";
import { redirect } from "@remix-run/node";

export async function requireManager(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    const manager = session.get("manager");

    if (!manager) {
        throw redirect("/managers/login");
    }

    return manager;
}

export async function redirectForAuthenticatedManager(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    const manager = session.get("manager");

    if (manager) {
        const managerId = manager.id;
        throw redirect(`/managers/${managerId}`);
    }
}
