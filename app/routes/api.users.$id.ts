import {ActionFunction, data} from "@remix-run/node";
import { requireManager } from "~/utils/auth.manager.server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const action: ActionFunction = async ({ request, params }) => {
    const manager = await requireManager(request);
    if (!manager) {
        return data({ message: "Unauthorized" }, { status: 401 });
    }

    if (request.method === "DELETE") {
        const userId = params.id; // URL パラメータから ID を取得

        if (!userId) {
            return data({ message: "Invalid input" }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return data({ message: "User deleted" }, { status: 200 });
    }

    return data({ message: "Method not allowed" }, { status: 405 });
};