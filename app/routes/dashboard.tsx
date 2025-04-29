import {ActionFunction, data, LoaderFunction, redirect} from "@remix-run/node";
import {Form, useLoaderData} from "@remix-run/react";
import { requireUser } from "~/utils/auth.server";
import {User} from "~/types/user";
import {destroySession, getSession} from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await requireUser(request);


    return data({ user });
};

export const action: ActionFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
};

interface LoaderData {
    user: User;
}

export default function Dashboard() {
    const { user } = useLoaderData<LoaderData>();
    return (
        <div>
            <h1 className={`font-bold`}>ようこそ、{user.email} さん</h1>
            <Form method="post">
                <button type="submit">ログアウト</button>
            </Form>
        </div>
    );
}
