import {ActionFunction, data, LoaderFunction} from "@remix-run/node";
import { requireManager } from "~/utils/auth.manager.server";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const loader: LoaderFunction = async ({ request }) => {
    const manager = await requireManager(request);
    if (!manager) {
        return data({ message: "Unauthorized"}, 401);
    }

    const users = await prisma.user.findMany({
        where: {
            manager_id: manager.id,
        },
        // include: {
        //     manager: true,
        // },
    });
    return data({
        message: "Welcome!",
        users: users,
    });
};

export const action: ActionFunction = async ({ request }) => {
    const manager = await requireManager(request);
    if (!manager) {
        return data({ message: "Unauthorized" }, { status: 401 });
    }

    if (request.method === "POST") {
        const json = await request.json();
        const email = json.email;
        const password  = json.password;
        const id = json.managerId as string;

        if (typeof email !== "string" || typeof password !== "string") {
            return data({ message: "Invalid input" }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: { email, password, manager_id: id },
        });

        return data(newUser, { status: 201 });
    }

    if (request.method === "DELETE") {
        const formData = await request.formData();
        const userId = formData.get("id");

        if (typeof userId !== "string") {
            return data({ message: "Invalid input" }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        return data({ message: "User deleted" }, { status: 200 });
    }

    return data({ message: "Method not allowed" }, { status: 405 });
};