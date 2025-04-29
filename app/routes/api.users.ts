import {data, LoaderFunction} from "@remix-run/node";
import { requireManager } from "~/utils/auth.manager.server";
import {PrismaClient} from "@prisma/client";

export const loader: LoaderFunction = async ({ request }) => {
    const manager = await requireManager(request);
    if (!manager) {
        return data({ message: "Unauthorized"}, 401);
    }

    const prisma = new PrismaClient();
    // todo: managerのrelationからuserを取得する
    const users = await prisma.user.findMany();
    return data({
        message: "Welcome!",
        user: users,
    });
};