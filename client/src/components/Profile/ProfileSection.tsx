import { useState } from "react";
import type { AuthUser } from "../../api/auth";
import { useProfileForm } from "../../hooks/useProfileForm";
import { isProfileComplete } from "../../utils/profileHelpers";
import ProfileView from "./ProfileView";
import ProfileForm from "./ProfileForm";

type ProfileSectionProps = {
  currentUser: AuthUser;
  onCurrentUserUpdate: (user: AuthUser) => void;
};

export default function ProfileSection({
  currentUser,
  onCurrentUserUpdate,
}: ProfileSectionProps) {
  const [mode, setMode] = useState<"view" | "create" | "edit">("view");
  const {
    formData,
    message,
    isSaving,
    handleChange,
    handleSubmit: handleFormSubmit,
    resetForm,
  } = useProfileForm(currentUser, (updatedUser) => {
    onCurrentUserUpdate(updatedUser);
    setMode("view");
  });

  const profileAlreadyMade = isProfileComplete(currentUser);

  function openProfileForm(nextMode: "create" | "edit") {
    setMode(nextMode);
  }

  function closeProfileForm() {
    resetForm();
    setMode("view");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    await handleFormSubmit(e, mode as "create" | "edit");
  }

  return (
    <section className="rounded-2xl border border-blue-200 bg-gray-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-semibold text-blue-400">
            My Profile
          </h2>
          <p className="text-sm text-blue-400">
            {profileAlreadyMade
              ? "Edit only your own profile information."
              : "Create your profile information to help find compatible roommates."}
          </p>
        </div>

        

          <button
            onClick={() => openProfileForm("edit")}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
      

      {mode === "view" ? (
        <ProfileView user={currentUser} />
      ) : (
        <ProfileForm
          mode={mode}
          formData={formData}
          message={message}
          isSaving={isSaving}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={closeProfileForm}
        />
      )}
    </section>
  );
}
