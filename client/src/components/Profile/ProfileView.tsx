import type { AuthUser } from "../../api/auth";

type ProfileViewProps = {
  user: AuthUser;
};

export default function ProfileView({ user }: ProfileViewProps) {
  return (
    <div className="mt-6 grid gap-3 text-sm text-blue-200 md:grid-cols-2">
      <p>
        <span className="font-medium">Username:</span> {user.username}
      </p>

      <p>
        <span className="font-medium">Email:</span> {user.email}
      </p>

      <p>
        <span className="font-medium">Phone:</span>{" "}
        {user.phone_number || "Not set"}
      </p>

      <p>
        <span className="font-medium">Real Name:</span>{" "}
        {user.real_name || "Not set"}
      </p>

      <p>
        <span className="font-medium">Grad Year:</span>{" "}
        {user.grad_year || "Not set"}
      </p>

      <p>
        <span className="font-medium">On Campus:</span>{" "}
        {user.is_oncampus ? "Yes" : "No"}
      </p>

      <p>
        <span className="font-medium">Gender:</span>{" "}
        {user.gender || "Not set"}
      </p>

      <p>
        <span className="font-medium">Major:</span> {user.major || "Not set"}
      </p>

      <p>
        <span className="font-medium">Home State:</span>{" "}
        {user.home_state || "Not set"}
      </p>
    </div>
  );
}
