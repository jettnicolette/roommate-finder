import type { AuthUser } from "../api/auth";
import ProfileSection from "../components/Profile/ProfileSection";

type DashboardPageProps = {
  currentUser: AuthUser;
  onCurrentUserUpdate: (user: AuthUser) => void;
  onLogout: () => void;
};

export default function DashboardPage({
  currentUser,
  onCurrentUserUpdate,
  onLogout,
}: DashboardPageProps) {

  return (
    <div className="min-h-screen bg-zinc-800 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-blue-200 bg-zinc-600 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">
              Welcome, {currentUser.real_name || currentUser.username}
            </h1>
            <p className="mt-1 text-sm text-blue-300">
              Logged in as @{currentUser.username}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="rounded-md border border-blue-300 px-4 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700"
          >
            Log Out
          </button>
        </header>

        <ProfileSection
          currentUser={currentUser}
          onCurrentUserUpdate={onCurrentUserUpdate}
        />

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-blue-400">
            Next Steps
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-blue-200 bg-zinc-600 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-100">Habits</h3>
              <p className="mt-2 text-sm text-blue-300">
                Add roommate preferences and lifestyle info later.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-zinc-600 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-100">Location</h3>
              <p className="mt-2 text-sm text-blue-300">
                Add housing or preferred location details later.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-zinc-600 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-100">
                Browse Roommates
              </h3>
              <p className="mt-2 text-sm text-blue-300">
                This will be a separate page later.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}