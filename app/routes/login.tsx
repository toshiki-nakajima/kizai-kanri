import {ActionFunction, LoaderFunction, data, redirect} from "@remix-run/node";
import { commitSession, getSession } from "~/utils/session.server";
import {Form, useActionData} from "@remix-run/react";
// import bcrypt from "bcryptjs";
import {getSessionExpirationDate} from "~/utils/session-expirty"; // compareするため
import {User} from "~/types/user";
import { PrismaClient } from "@prisma/client";
import {redirectForAuthenticatedUser} from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
    await redirectForAuthenticatedUser(request);

    return null; // ログインしていない場合はそのまま表示
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("email:", email);
    console.log("password", password);
    if (typeof email !== "string" || typeof password !== "string") {
        return data({ error: "無効な入力です" }, { status: 400 });
    }

    // 通常はここでDBからユーザーを探すが…
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return data({ error: "メールアドレスまたはパスワードが違います" }, { status: 401 });
    }

    // パスワードの検証（本来はDBから取得したユーザー情報を使う）
    // if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    //     return data({ error: "メールアドレスまたはパスワードが違います" }, { status: 401 });
    // }

    const session = await getSession();
    session.set("user", user);

    // 24時にセッションが切れるようにする
    const expires = getSessionExpirationDate();

    return redirect("/dashboard", {
        headers: {
            "Set-Cookie": await commitSession(session, { expires }),
        },
    });
};

interface ActionData {
    user?: User;
    error?: string;
}
export default function Login() {
    const actionData = useActionData<ActionData>();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">ログイン</h1>
                <Form method="post" className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
                            メールアドレス
                        </label>
                        <input
                            className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
                            パスワード
                        </label>
                        <input
                            className="w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        ログイン
                    </button>
                    {actionData?.error && (
                        <p className="mt-2 text-sm text-red-600">{actionData.error}</p>
                    )}
                </Form>
            </div>
        </div>
    );
}
