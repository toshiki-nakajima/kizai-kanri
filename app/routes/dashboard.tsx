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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    ようこそ、{user.email} さん
                </h1>
                <p className="text-gray-600 mb-4">
                    ここはダッシュボードです。ユーザー情報を表示しています。
                </p>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">ユーザー情報</h2>
                    <ul className="list-disc list-inside">
                        <li>role: {user.role}</li>
                        {/* 他のユーザー情報をここに追加 */}
                    </ul>
                </div>
                <Form method="post" className="text-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        ログアウト
                    </button>
                </Form>
            </div>
        </div>
    );
}

