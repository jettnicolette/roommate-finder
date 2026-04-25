import type { AuthUser } from "../api/auth";

// Props coming from App.tsx.
type DashboardPageProps = {
  currentUser: AuthUser;
  onLogout: () => void;
};

export default function DashboardPage({
  currentUser,
  onLogout,
}: DashboardPageProps) {
  return (
    <div className="min-h-screen bg-zinc-800 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Top header */}
        <header className="flex flex-col gap-4 rounded-2xl border border-blue-200 bg-zinc-600 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-blue-400 text-3xl font-bold">
              Welcome, {currentUser.real_name}
            </h1>
            <p className="mt-1 text-sm text-blue-300">
              Logged in as @{currentUser.username}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="rounded-md border border-blue-300 px-4 py-2 text-sm font-medium hover:bg-blue-100"
          >
            Log Out
          </button>
        </header>

        {/* Current user summary */}
        <section className="rounded-2xl border border-blue-200 bg-zinc-600 p-6 shadow-sm">
          <h2 className="text-blue-300 mb-4 text-2xl font-semibold">Account Summary</h2>

          <div className="text-blue-200 grid gap-3 text-sm md:grid-cols-2">
            <p>
              <span className="font-medium">Username:</span> {currentUser.username}
            </p>
            <p>
              <span className="font-medium">Email:</span> {currentUser.email}
            </p>
            <p>
              <span className="font-medium">On campus:</span>{" "}
              {currentUser.is_oncampus ? "Yes" : "No"}
            </p>
            {currentUser.major && (
              <p>
                <span className="font-medium">Major:</span> {currentUser.major}
              </p>
            )}
          </div>
        </section>

        {/* Placeholder app sections */}
        <section>
          <h2 className="text-blue-400 mb-4 text-2xl font-semibold">Next Steps</h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-blue-200 bg-zinc-600 p-5 shadow-sm">
              <h3 className="text-lg font-semibold">Profile</h3>
              <p className="mt-2 text-sm text-blue-300">
                Edit user info and account details.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-zinc-600 p-5 shadow-sm">
              <h3 className="text-lg font-semibold">Habits</h3>
              <p className="mt-2 text-sm text-blue-300">
                Add roommate preferences and lifestyle info.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-zinc-600 p-5 shadow-sm">
              <h3 className="text-lg font-semibold">Location</h3>
              <p className="mt-2 text-sm text-blue-300">
                Add housing or preferred location details.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-zinc-600 p-5 shadow-sm">
              <h3 className="text-lg font-semibold">Browse Roommates</h3>
              <p className="mt-2 text-sm text-blue-300">
                Search for potential matches.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}