import { useAppDispatch } from "@/redux/hooks";
import { setSuccessMessage } from "@/redux/slices/alertSlice";
import { removeAuthenticatedUser } from "@/redux/slices/authenticatedUserSlice";
import logoutUser from "@/requests/logoutUser";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserProfileCardProps {
  email: string;
  fullName: string;
}

export default function UserProfileCard({
  email,
  fullName,
}: UserProfileCardProps) {
  const [confirmLogout, setConfirmLogout] = useState(false);

  const dispatch = useAppDispatch();

  const router = useRouter();

  function handleLogout() {
    if (confirmLogout) {
      logoutUser().then(() => {
        dispatch(removeAuthenticatedUser());
        dispatch(setSuccessMessage("Logged out successfully."));
        router.push("/");
      });
    } else {
      setConfirmLogout(true);
    }
  }

  return (
    <div className="card bg-base-100 w-48 h-fit shadow-xl">
      <div className="card-body">
        <div className="avatar placeholder">
          <div className="bg-base-300 text-base-400 w-16 mx-auto rounded-full">
            <span className="text-3xl">{fullName.charAt(0)}</span>
          </div>
        </div>
        <p className="font-semibold">{fullName}</p>
        <p className="font-semibold">{email}</p>
        <button
          className={`btn btn-sm ${
            confirmLogout ? "btn-warning" : "btn-primary"
          }`}
          onClick={handleLogout}
        >
          {confirmLogout ? "Confirm" : "Log out"}
        </button>
      </div>
    </div>
  );
}
