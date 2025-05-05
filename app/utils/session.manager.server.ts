import { createCookieSessionStorage } from "@remix-run/node";
import * as process from "node:process";

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "__manager_session",
        secrets: [(process.env.SESSION_SECRET ?? "your-secret")],
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        path: "/",
        // maxAge: 60 * 60 * 24 * 7, // 7日
    },
});

process.env
export const { getSession, commitSession, destroySession } = sessionStorage;