import {ActionFunction, data, redirect} from "@remix-run/node";
import { commitSession, getSession } from "~/utils/session.server";
import {Form, useActionData} from "@remix-run/react";
// import bcrypt from "bcryptjs";
import {getSessionExpirationDate} from "~/utils/session-expirty"; // compareするため
import {User} from "~/types/user";
import { PrismaClient } from "@prisma/client";

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
        <Form method="post">
            <input className={`border-2`} name="email" type="email" placeholder="Email" required />
            <input className={`border-2`} name="password" type="password" placeholder="Password" required />
            <button type="submit">ログイン</button>
            {actionData?.error && <p>{actionData.error}</p>}
        </Form>
    );
}