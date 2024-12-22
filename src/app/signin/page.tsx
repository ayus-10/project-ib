"use client";

import UserForm from "@/components/UserForm";
import { ACCESS_TOKEN, SIGNIN } from "@/constants";
import { AuthResponse } from "@/interfaces/AuthResponse";
import { SigninPayload } from "@/interfaces/SigninPayload";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage, setSuccessMessage } from "@/redux/slices/alertSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signin() {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleSignin(payload: SigninPayload) {
    try {
      setLoading(true);
      const res = await axios.post<AuthResponse>("/api/auth", payload);
      localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
      dispatch(setSuccessMessage("Signed in successfully."));
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error?.response?.data.error));
      }
      console.log("Unable to sign in: ", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserForm
      formType={SIGNIN}
      handleSignin={handleSignin}
      isLoading={loading}
    />
  );
}
