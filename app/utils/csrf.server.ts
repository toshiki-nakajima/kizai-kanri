
import { createCookieSessionStorage} from "@remix-run/node";
import { randomBytes } from "crypto";

const CSRF_TOKEN_KEY = "csrfToken";

// セッションストレージ（名前を明示的に分ける）
const csrfSessionStorage = createCookieSessionStorage({
    cookie: {
        name: "__csrf_token_session",
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        secrets: [process.env.SESSION_SECRET || "default-secret"],
    },
});

// セッション取得
export async function getCsrfSession(request: Request) {
    const cookieHeader = request.headers.get("Cookie");
    return csrfSessionStorage.getSession(cookieHeader);
}

// CSRFトークンを生成してセッションにセット＆cookie出力
export async function generateCsrfToken(request: Request) {
    const session = await getCsrfSession(request);
    const token = randomBytes(32).toString("hex");

    session.set(CSRF_TOKEN_KEY, token);

    return {
        token,
        setCookie: await csrfSessionStorage.commitSession(session),
    };
}

// トークン検証
export async function verifyCsrfToken(request: Request, submittedToken: string | null) {
    const session = await getCsrfSession(request);
    const storedToken = session.get(CSRF_TOKEN_KEY);

    if (!storedToken || submittedToken !== storedToken) {
        throw new Response("Invalid CSRF token", { status: 403 });
    }
}

// できればwrapしたい
// export function withcsrfcheck(actionfn: actionfunction): actionfunction {
//     return async (args: ActionFunctionArgs) => {
//         const session = await getSession(args.request.headers.get("Cookie"));
//         await verifyCsrfToken(args.request, session);
//         return actionFn(args);
//     };
// }