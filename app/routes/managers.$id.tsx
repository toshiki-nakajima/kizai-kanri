import {useEffect, useState} from 'react';
import {ActionFunction, data, LoaderFunction, redirect} from "@remix-run/node";
import axios from "axios";
import {useLoaderData, Form} from "@remix-run/react";

import {requireManager} from "~/utils/auth.manager.server";
import { Manager } from '~/types/manager';
import {User} from "~/types/user";
import {destroySession, getSession} from "~/utils/session.manager.server";
import { z } from "zod"; // zodをインポート

// フォームデータのスキーマを定義
const userSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上である必要があります"),
  managerId: z.string(),
});

export const loader: LoaderFunction = async ({ request }) => {
  const manager = await requireManager(request);
  return data({ manager});
}
interface LoaderData {
  manager: Manager;
}

export const action: ActionFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/managers/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
};

const UserManager = () => {
  const {manager} = useLoaderData<LoaderData>();
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ email: '',password: '', managerId: manager.id});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('/api/users');
    setUsers(response.data.users);
  };

  const handleAddUser = async () => {
    try {
      // フォームデータをバリデーション
      userSchema.parse(form);

      const response = await axios.post('/api/users', form);
      setUsers([...users, response.data]);
      setForm({ password: '', email: '', managerId: manager.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.errors.map(err => err.message).join("\n")); // エラーメッセージを表示
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("本当にこのユーザーを削除しますか？")) {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">User Manager</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Manager ID: {manager.id}</h2>
      </div>
      {/* ログアウトボタンを追加 */}
      <div className="mb-6">
        <Form method="post">
          <button 
            type="submit" 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            ログアウト
          </button>
        </Form>
      </div>
      {/* ユーザー追加セクション */}
      <div className="mb-8 p-6 bg-white shadow-md rounded">
        <h3 className="text-xl font-semibold mb-4">新しいユーザーを追加</h3>
        <div className="flex gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="p-2 border border-gray-300 rounded w-1/3"
          />
          <input
            type="text"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="p-2 border border-gray-300 rounded w-1/3"
          />
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </div>
      </div>
      <table className="table-auto w-full bg-white shadow-md rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                <button 
                  onClick={() => handleDeleteUser(user.id)} 
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;

