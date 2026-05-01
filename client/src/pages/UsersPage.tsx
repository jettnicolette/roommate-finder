import { useEffect, useState } from "react";
import UserForm from "../components/UserForm";
import { createUser, deleteUser, getUsers } from "../api/users";
import type { CreateUserInput, User } from "../types/user";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  async function loadUsers() {
    try {
      setPageError("");
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setPageError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreateUser(data: CreateUserInput) {
    await createUser(data);
    await loadUsers();
  }

  async function handleDeleteUser(userId: number) {
    const confirmed = window.confirm("Delete this user?");
    if (!confirmed) return;

    try {
      await deleteUser(userId);
      await loadUsers();
    } catch (err) {
      setPageError(err instanceof Error ? err.message : "Failed to delete user");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold">Roommate Finder</h1>
        <p className="text-gray-600">Simple starter page for testing users CRUD.</p>
      </header>

      <UserForm onSubmit={handleCreateUser} />

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Users</h2>
          <p className="text-sm text-gray-600">
            Current users coming from the Express API.
          </p>
        </div>

        {pageError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {pageError}
          </p>
        )}

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => (
              <article
                key={user.user_id}
                className="space-y-3 rounded-xl border border-gray-200 p-4 shadow-sm"
              >
                <div>
                  <h3 className="text-lg font-semibold">{user.real_name}</h3>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>

                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p>
                    <span className="font-medium">On campus:</span>{" "}
                    {user.is_oncampus ? "Yes" : "No"}
                  </p>
                  {user.major && (
                    <p>
                      <span className="font-medium">Major:</span> {user.major}
                    </p>
                  )}
                  {user.grad_year && (
                    <p>
                      <span className="font-medium">Grad Year:</span>{" "}
                      {user.grad_year}
                    </p>
                  )}
                  {user.home_state && (
                    <p>
                      <span className="font-medium">Home State:</span>{" "}
                      {user.home_state}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteUser(user.user_id)}
                  className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
