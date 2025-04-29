import {useEffect, useState} from 'react';
import {ActionFunction, data, LoaderFunction, redirect} from "@remix-run/node";
import axios from "axios";
import {useLoaderData, Form} from "@remix-run/react";

import {requireManager} from "~/utils/auth.manager.server";
import { Manager } from '~/types/manager';
import {User} from "~/types/user";
import {destroySession, getSession} from "~/utils/session.manager.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const manager = await requireManager(request);
  const id = params.id;
    console.log("id", id);
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
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('/api/users');
      console.log(response.data);
    // setUsers(response.data);
    setUsers([]);
  };

  const handleAddUser = async () => {
    // const response = await axios.post('/api/users', form);
    // setUsers([...users, response.data]);
    // setForm({ name: '', email: '' });
  };

  const handleDeleteUser = async (id: string) => {
    console.log(id);
    // await axios.delete(`/api/users/${id}`);
    // setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div>
      <h1>User Manager</h1>
      <div>
        <h2>Manager ID: {manager.id}</h2>
      </div>
      {/* ログアウトボタンを追加 */}
      <div>
        <Form method="post">
          <button type="submit">ログアウト</button>
        </Form>
      </div>
      <div>
        <p>ユーザーを追加する</p>
      </div>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
