"use client";

import { DARK, LIGHT } from "@/constants";
import useThemes from "@/hooks/useThemes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { setSuccessMessage } from "@/redux/slices/alertSlice";
import { removeAuthenticatedUser } from "@/redux/slices/authenticatedUserSlice";
import logoutUser from "@/requests/logoutUser";

export default function NavBar() {
  const [theme, setTheme] = useThemes();

  const pathname = usePathname();

  const navLinks = [
    {
      title: "Sign in",
      path: "/signin",
    },
    {
      title: "Sign up",
      path: "/signup",
    },
    {
      title: "Admin",
      path: "/admin",
    },
    {
      title: "Home",
      path: "/",
    },
  ];

  function toggleTheme(e: ChangeEvent<HTMLInputElement>) {
    const isDark = e.target.checked;

    setTheme(isDark ? DARK : LIGHT);
  }

  return (
    <div className="navbar bg-base-100 border-b shadow-md border-base-300 relative">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {navLinks.map((link) =>
              pathname !== link.path ? (
                <li key={link.path}>
                  <Link href={link.path}>{link.title}</Link>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link href="/" className="btn btn-ghost text-xl">
          iBerozgar
        </Link>
      </div>
      <div className="navbar-end">
        <label className="flex cursor-pointer gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <input
            type="checkbox"
            value="synthwave"
            className="toggle theme-controller"
            checked={theme === DARK}
            onChange={toggleTheme}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>
        <UserProfile />
      </div>
    </div>
  );
}

function UserProfile() {
  const [showProfileCard, setShowProfileCard] = useState(false);

  const pathname = usePathname();

  const router = useRouter();

  const { email, fullName } = useAppSelector(
    (state) => state.authenticatedUser
  );

  const isLoggedIn = !!email && !!fullName;

  if (pathname !== "/") return null;

  return (
    <>
      <button
        className="ml-4 btn btn-outline btn-square btn-sm"
        onClick={() =>
          isLoggedIn
            ? setShowProfileCard((prev) => !prev)
            : router.push("/signin")
        }
      >
        <FaUser />
      </button>
      {showProfileCard && isLoggedIn ? (
        <UserProfileCard email={email} fullName={fullName} />
      ) : null}
    </>
  );
}

interface UserProfileCardProps {
  email: string;
  fullName: string;
}

function UserProfileCard({ email, fullName }: UserProfileCardProps) {
  const [confirmLogout, setConfirmLogout] = useState(false);

  const dispatch = useAppDispatch();

  function handleLogout() {
    if (confirmLogout) {
      logoutUser().then(() => {
        dispatch(removeAuthenticatedUser());
        dispatch(setSuccessMessage("Logged out successfully."));
      });
    } else {
      setConfirmLogout(true);
    }
  }

  return (
    <div className="absolute right-1 top-full mt-1">
      <div className="card bg-base-100 w-48 h-fit shadow-xl">
        <div className="card-body">
          <div className="avatar placeholder">
            <div className="bg-base-300 text-base-400 w-16 mx-auto rounded-full">
              <span className="text-3xl">{fullName.charAt(0)}</span>
            </div>
          </div>
          <p className="font-semibold text-center">{fullName}</p>
          <p className="font-semibold text-center">{email}</p>
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
    </div>
  );
}
